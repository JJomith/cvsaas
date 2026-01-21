import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware';
import bcrypt from 'bcryptjs';

// Get dashboard stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalDocuments,
      documentsToday,
      totalRevenue,
      revenueToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.document.count(),
      prisma.document.count({ where: { createdAt: { gte: today } } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: today } },
        _sum: { amount: true },
      }),
    ]);

    // Active users (users who created documents in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await prisma.document.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // Credit usage today
    const creditUsageToday = await prisma.creditUsage.aggregate({
      where: {
        createdAt: { gte: today },
        action: { in: ['CV_GENERATION', 'COVER_LETTER_GENERATION', 'ATS_OPTIMIZATION'] },
      },
      _sum: { credits: true },
    });

    res.json({
      stats: {
        totalUsers,
        activeUsers: activeUsers.length,
        totalDocuments,
        totalRevenue: totalRevenue._sum.amount || 0,
        newUsersToday,
        documentsToday,
        revenueToday: revenueToday._sum.amount || 0,
        creditUsageToday: creditUsageToday._sum.credits || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

// Get users list
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);

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
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          credits: {
            select: {
              balance: true,
              totalPurchased: true,
              totalUsed: true,
            },
          },
          _count: {
            select: { documents: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Get single user
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        credits: true,
        profile: {
          include: {
            experiences: true,
            education: true,
            skills: true,
          },
        },
        documents: {
          orderBy: { updatedAt: 'desc' },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { creditPack: true },
        },
        creditUsages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, emailVerified } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        emailVerified: emailVerified ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Grant credits to user
export const grantCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, credits, reason } = req.body;

    await prisma.userCredits.upsert({
      where: { userId },
      update: {
        balance: { increment: credits },
        totalPurchased: { increment: credits },
      },
      create: {
        userId,
        balance: credits,
        totalPurchased: credits,
        totalUsed: 0,
      },
    });

    // Log the grant
    await prisma.creditUsage.create({
      data: {
        userId,
        credits,
        action: 'ADMIN_GRANT',
        metadata: { reason, grantedBy: req.user!.id },
      },
    });

    const userCredits = await prisma.userCredits.findUnique({
      where: { userId },
    });

    res.json({
      message: `Successfully granted ${credits} credits`,
      balance: userCredits?.balance || 0,
    });
  } catch (error) {
    console.error('Grant credits error:', error);
    res.status(500).json({ error: 'Failed to grant credits' });
  }
};

// AI Providers Management
export const getAIProviders = async (req: AuthRequest, res: Response) => {
  try {
    const providers = await prisma.aIProvider.findMany({
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });

    // Mask API keys
    const maskedProviders = providers.map(p => ({
      ...p,
      apiKey: p.apiKey.substring(0, 10) + '...' + p.apiKey.substring(p.apiKey.length - 4),
    }));

    res.json({ providers: maskedProviders });
  } catch (error) {
    console.error('Get AI providers error:', error);
    res.status(500).json({ error: 'Failed to get AI providers' });
  }
};

export const createAIProvider = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, apiKey, model, isActive, isPrimary, costPerToken, maxTokens } = req.body;

    // If setting as primary, unset other primaries
    if (isPrimary) {
      await prisma.aIProvider.updateMany({
        data: { isPrimary: false },
      });
    }

    const provider = await prisma.aIProvider.create({
      data: {
        name,
        type,
        apiKey,
        model,
        isActive: isActive ?? true,
        isPrimary: isPrimary ?? false,
        costPerToken: costPerToken ?? 0,
        maxTokens: maxTokens ?? 4096,
      },
    });

    res.status(201).json({
      provider: {
        ...provider,
        apiKey: provider.apiKey.substring(0, 10) + '...',
      },
    });
  } catch (error) {
    console.error('Create AI provider error:', error);
    res.status(500).json({ error: 'Failed to create AI provider' });
  }
};

export const updateAIProvider = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, apiKey, model, isActive, isPrimary, costPerToken, maxTokens } = req.body;

    // If setting as primary, unset other primaries
    if (isPrimary) {
      await prisma.aIProvider.updateMany({
        where: { id: { not: id } },
        data: { isPrimary: false },
      });
    }

    const provider = await prisma.aIProvider.update({
      where: { id },
      data: {
        name,
        type,
        ...(apiKey && { apiKey }),
        model,
        isActive,
        isPrimary,
        costPerToken,
        maxTokens,
      },
    });

    res.json({
      provider: {
        ...provider,
        apiKey: provider.apiKey.substring(0, 10) + '...',
      },
    });
  } catch (error) {
    console.error('Update AI provider error:', error);
    res.status(500).json({ error: 'Failed to update AI provider' });
  }
};

export const deleteAIProvider = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.aIProvider.delete({ where: { id } });

    res.json({ message: 'AI provider deleted' });
  } catch (error) {
    console.error('Delete AI provider error:', error);
    res.status(500).json({ error: 'Failed to delete AI provider' });
  }
};

// Credit Packs Management
export const createCreditPack = async (req: AuthRequest, res: Response) => {
  try {
    const { name, credits, price, currency, active, popular, features } = req.body;

    const pack = await prisma.creditPack.create({
      data: {
        name,
        credits,
        price,
        currency: currency || 'USD',
        active: active ?? true,
        popular: popular ?? false,
        features: features || [],
      },
    });

    res.status(201).json({ pack });
  } catch (error) {
    console.error('Create credit pack error:', error);
    res.status(500).json({ error: 'Failed to create credit pack' });
  }
};

export const updateCreditPack = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, credits, price, currency, active, popular, features } = req.body;

    const pack = await prisma.creditPack.update({
      where: { id },
      data: {
        name,
        credits,
        price,
        currency,
        active,
        popular,
        features,
      },
    });

    res.json({ pack });
  } catch (error) {
    console.error('Update credit pack error:', error);
    res.status(500).json({ error: 'Failed to update credit pack' });
  }
};

export const deleteCreditPack = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.creditPack.delete({ where: { id } });

    res.json({ message: 'Credit pack deleted' });
  } catch (error) {
    console.error('Delete credit pack error:', error);
    res.status(500).json({ error: 'Failed to delete credit pack' });
  }
};

// Promo Codes Management
export const getPromoCodes = async (req: AuthRequest, res: Response) => {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { redemptions: true } },
      },
    });

    res.json({ promoCodes });
  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ error: 'Failed to get promo codes' });
  }
};

export const createPromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code, credits, discountPercent, maxUses, expiresAt, active } = req.body;

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        credits: credits || 0,
        discountPercent,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active ?? true,
      },
    });

    res.status(201).json({ promoCode });
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
};

export const updatePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { credits, discountPercent, maxUses, expiresAt, active } = req.body;

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        credits,
        discountPercent,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active,
      },
    });

    res.json({ promoCode });
  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({ error: 'Failed to update promo code' });
  }
};

export const deletePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.promoCode.delete({ where: { id } });

    res.json({ message: 'Promo code deleted' });
  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({ error: 'Failed to delete promo code' });
  }
};

// Templates Management
export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, description, thumbnail, isPremium, active, defaultSections, styles } = req.body;

    const template = await prisma.template.create({
      data: {
        name,
        type,
        description,
        thumbnail,
        isPremium: isPremium ?? false,
        active: active ?? true,
        defaultSections: defaultSections || [],
        styles: styles || {},
      },
    });

    res.status(201).json({ template });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
};

export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, description, thumbnail, isPremium, active, defaultSections, styles } = req.body;

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        type,
        description,
        thumbnail,
        isPremium,
        active,
        defaultSections,
        styles,
      },
    });

    res.json({ template });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
};

export const deleteTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if template is in use
    const documentsCount = await prisma.document.count({
      where: { templateId: id },
    });

    if (documentsCount > 0) {
      return res.status(400).json({
        error: `Cannot delete template. It is used by ${documentsCount} documents.`,
      });
    }

    await prisma.template.delete({ where: { id } });

    res.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
};

// System Config
export const getSystemConfig = async (req: AuthRequest, res: Response) => {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });

    res.json({ configs });
  } catch (error) {
    console.error('Get system config error:', error);
    res.status(500).json({ error: 'Failed to get system config' });
  }
};

export const updateSystemConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { configs } = req.body;

    for (const config of configs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: { value: config.value, description: config.description },
        create: { key: config.key, value: config.value, description: config.description },
      });
    }

    const updatedConfigs = await prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });

    res.json({ configs: updatedConfigs });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({ error: 'Failed to update system config' });
  }
};

// Analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { days = '30' } = req.query as any;
    const daysNum = parseInt(days);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Usage analytics by day
    const usageByDay = await prisma.creditUsage.groupBy({
      by: ['createdAt', 'action'],
      where: {
        createdAt: { gte: startDate },
        action: { in: ['CV_GENERATION', 'COVER_LETTER_GENERATION', 'ATS_OPTIMIZATION'] },
      },
      _count: true,
    });

    // Revenue by day
    const revenueByDay = await prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
      _count: true,
    });

    // New users by day
    const usersByDay = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // Top templates
    const topTemplates = await prisma.document.groupBy({
      by: ['templateId'],
      _count: true,
      orderBy: { _count: { templateId: 'desc' } },
      take: 5,
    });

    res.json({
      usageByDay,
      revenueByDay,
      usersByDay,
      topTemplates,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};
