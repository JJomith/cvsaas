import express from 'express';
import { prisma } from '../../config/database';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { Prisma } from '@prisma/client';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard overview stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalDocuments,
      totalRevenue,
      recentSignups,
      documentsByType,
      creditUsageToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.document.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.document.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
      prisma.creditUsage.aggregate({
        _sum: { credits: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          credits: { lt: 0 },
        },
      }),
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalDocuments,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentSignups,
      documentsByType: documentsByType.map((d: any) => ({
        type: d.type,
        count: d._count.id,
      })),
      creditUsageToday: Math.abs(creditUsageToday._sum.credits || 0),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Revenue chart data
router.get('/revenue', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueByDate = payments.reduce((acc: Record<string, number>, payment: any) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {});

    res.json(revenueByDate);
  } catch (error) {
    console.error('Revenue data error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
          emailVerified: true,
          credits: {
            select: {
              balance: true,
              totalPurchased: true,
              totalUsed: true,
            },
          },
          _count: {
            select: {
              documents: true,
              payments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        credits: true,
        documents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        creditUsage: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user
router.patch('/users/:id', async (req, res) => {
  try {
    const { role, emailVerified } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(role && { role }),
        ...(typeof emailVerified === 'boolean' && { emailVerified }),
      },
    });

    res.json(user);
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Add credits to user
router.post('/users/:id/credits', async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.userCredits.upsert({
        where: { userId: req.params.id },
        create: {
          userId: req.params.id,
          balance: amount,
          totalPurchased: amount > 0 ? amount : 0,
          totalUsed: 0,
        },
        update: {
          balance: { increment: amount },
          ...(amount > 0 && { totalPurchased: { increment: amount } }),
        },
      });

      await tx.creditUsage.create({
        data: {
          userId: req.params.id,
          credits: amount,
          action: 'ADMIN_ADJUSTMENT',
          description: reason || `Admin adjustment: ${amount > 0 ? '+' : ''}${amount} credits`,
        },
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Credit adjustment error:', error);
    res.status(500).json({ error: 'Failed to adjust credits' });
  }
});

// AI Provider Settings
router.get('/settings/ai', async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst({
      where: { key: 'ai_provider' },
    });

    res.json({
      provider: settings?.value || 'openai',
      model: (settings?.metadata as any)?.model || 'gpt-4o-mini',
    });
  } catch (error) {
    console.error('AI settings error:', error);
    res.status(500).json({ error: 'Failed to fetch AI settings' });
  }
});

router.put('/settings/ai', async (req, res) => {
  try {
    const { provider, model } = req.body;

    const validProviders = ['openai', 'anthropic', 'google'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ error: 'Invalid AI provider' });
    }

    await prisma.systemSettings.upsert({
      where: { key: 'ai_provider' },
      create: {
        key: 'ai_provider',
        value: provider,
        metadata: { model },
      },
      update: {
        value: provider,
        metadata: { model },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('AI settings update error:', error);
    res.status(500).json({ error: 'Failed to update AI settings' });
  }
});

// Credit Pack Management
router.get('/credit-packs', async (req, res) => {
  try {
    const packs = await prisma.creditPack.findMany({
      orderBy: { price: 'asc' },
    });

    res.json(packs);
  } catch (error) {
    console.error('Credit packs error:', error);
    res.status(500).json({ error: 'Failed to fetch credit packs' });
  }
});

router.post('/credit-packs', async (req, res) => {
  try {
    const { name, credits, price, popular } = req.body;

    const pack = await prisma.creditPack.create({
      data: {
        name,
        credits,
        price,
        popular: popular || false,
        active: true,
      },
    });

    res.json(pack);
  } catch (error) {
    console.error('Create credit pack error:', error);
    res.status(500).json({ error: 'Failed to create credit pack' });
  }
});

router.put('/credit-packs/:id', async (req, res) => {
  try {
    const { name, credits, price, popular, active } = req.body;

    const pack = await prisma.creditPack.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(credits && { credits }),
        ...(price && { price }),
        ...(typeof popular === 'boolean' && { popular }),
        ...(typeof active === 'boolean' && { active }),
      },
    });

    res.json(pack);
  } catch (error) {
    console.error('Update credit pack error:', error);
    res.status(500).json({ error: 'Failed to update credit pack' });
  }
});

// Promo Code Management
router.get('/promo-codes', async (req, res) => {
  try {
    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(codes);
  } catch (error) {
    console.error('Promo codes error:', error);
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

router.post('/promo-codes', async (req, res) => {
  try {
    const { code, credits, maxUses, expiresAt } = req.body;

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        credits,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true,
        usedCount: 0,
      },
    });

    res.json(promoCode);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Promo code already exists' });
    }
    console.error('Create promo code error:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

router.put('/promo-codes/:id', async (req, res) => {
  try {
    const { active, maxUses, expiresAt } = req.body;

    const promoCode = await prisma.promoCode.update({
      where: { id: req.params.id },
      data: {
        ...(typeof active === 'boolean' && { active }),
        ...(maxUses !== undefined && { maxUses }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    });

    res.json(promoCode);
  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({ error: 'Failed to update promo code' });
  }
});

// Document Statistics
router.get('/documents', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;

    const where = type ? { type } : {};

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.document.count({ where }),
    ]);

    res.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Documents list error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Payment History
router.get('/payments', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.payment.count(),
    ]);

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Payments list error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export default router;
