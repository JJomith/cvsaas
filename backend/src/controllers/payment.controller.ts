import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/database';
import { config } from '../config';
import { AuthRequest } from '../middleware';
import { emailService } from '../services/email';

const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey) : null;

// Get user credits
export const getCredits = async (req: AuthRequest, res: Response) => {
  try {
    let credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    if (!credits) {
      // Create credits record if it doesn't exist
      const freeCreditsConfig = await prisma.systemConfig.findUnique({
        where: { key: 'free_credits' },
      });
      const freeCredits = parseFloat(freeCreditsConfig?.value || '3');

      credits = await prisma.userCredits.create({
        data: {
          userId: req.user!.id,
          balance: freeCredits,
          totalPurchased: freeCredits,
          totalUsed: 0,
        },
      });
    }

    // Get recent usage
    const recentUsage = await prisma.creditUsage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({ credits, recentUsage });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Failed to get credits' });
  }
};

// Get credit packs
export const getCreditPacks = async (req: Request, res: Response) => {
  try {
    const packs = await prisma.creditPack.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });

    res.json({ packs });
  } catch (error) {
    console.error('Get credit packs error:', error);
    res.status(500).json({ error: 'Failed to get credit packs' });
  }
};

// Create checkout session
export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    const { creditPackId } = req.body;

    const pack = await prisma.creditPack.findUnique({
      where: { id: creditPackId },
    });

    if (!pack || !pack.active) {
      return res.status(404).json({ error: 'Credit pack not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: pack.currency.toLowerCase(),
            product_data: {
              name: pack.name,
              description: `${pack.credits} AI generation credits`,
            },
            unit_amount: Math.round(pack.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user!.id,
        creditPackId: pack.id,
        credits: pack.credits.toString(),
      },
      success_url: `${config.frontendUrl}/dashboard/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/dashboard/credits?canceled=true`,
    });

    // Create pending payment record
    await prisma.payment.create({
      data: {
        userId: req.user!.id,
        amount: pack.price,
        currency: pack.currency,
        status: 'PENDING',
        stripeSessionId: session.id,
        creditPackId: pack.id,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Stripe webhook
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhookSecret
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(paymentIntent);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { userId, creditPackId, credits } = session.metadata || {};

  if (!userId || !credits) {
    console.error('Missing metadata in session:', session.id);
    return;
  }

  // Update payment status
  await prisma.payment.updateMany({
    where: { stripeSessionId: session.id },
    data: {
      status: 'COMPLETED',
      stripePaymentId: session.payment_intent as string,
    },
  });

  const creditsAmount = parseFloat(credits);

  // Add credits to user
  await prisma.userCredits.upsert({
    where: { userId },
    update: {
      balance: { increment: creditsAmount },
      totalPurchased: { increment: creditsAmount },
    },
    create: {
      userId,
      balance: creditsAmount,
      totalPurchased: creditsAmount,
      totalUsed: 0,
    },
  });

  // Log credit usage
  await prisma.creditUsage.create({
    data: {
      userId,
      credits: creditsAmount,
      action: 'PURCHASE',
      metadata: { sessionId: session.id },
    },
  });

  // Send confirmation email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await emailService.sendPurchaseConfirmation(
      user.email,
      user.name || '',
      creditsAmount,
      session.amount_total ? session.amount_total / 100 : 0,
      session.currency?.toUpperCase() || 'USD'
    );
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  // Update payment status if we can find it
  if (paymentIntent.id) {
    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: 'FAILED' },
    });
  }
}

// Redeem promo code
export const redeemPromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    if (!promoCode.active) {
      return res.status(400).json({ error: 'This promo code is no longer active' });
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return res.status(400).json({ error: 'This promo code has expired' });
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ error: 'This promo code has reached its usage limit' });
    }

    // Check if user already used this code
    const existingRedemption = await prisma.promoRedemption.findUnique({
      where: {
        promoCodeId_userId: {
          promoCodeId: promoCode.id,
          userId: req.user!.id,
        },
      },
    });

    if (existingRedemption) {
      return res.status(400).json({ error: 'You have already used this promo code' });
    }

    // Apply promo code
    await prisma.userCredits.upsert({
      where: { userId: req.user!.id },
      update: {
        balance: { increment: promoCode.credits },
        totalPurchased: { increment: promoCode.credits },
      },
      create: {
        userId: req.user!.id,
        balance: promoCode.credits,
        totalPurchased: promoCode.credits,
        totalUsed: 0,
      },
    });

    // Record redemption
    await prisma.promoRedemption.create({
      data: {
        promoCodeId: promoCode.id,
        userId: req.user!.id,
      },
    });

    // Update usage count
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: { usedCount: { increment: 1 } },
    });

    // Log credit usage
    await prisma.creditUsage.create({
      data: {
        userId: req.user!.id,
        credits: promoCode.credits,
        action: 'PROMO_CODE',
        metadata: { code: promoCode.code },
      },
    });

    const credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    res.json({
      message: `Successfully redeemed ${promoCode.credits} credits!`,
      creditsAdded: promoCode.credits,
      currentBalance: credits?.balance || 0,
    });
  } catch (error) {
    console.error('Redeem promo code error:', error);
    res.status(500).json({ error: 'Failed to redeem promo code' });
  }
};

// Get payment history
export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      include: {
        creditPack: {
          select: {
            name: true,
            credits: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
};
