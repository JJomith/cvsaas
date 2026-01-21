import Stripe from 'stripe';
import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular?: boolean;
}

// Default credit packs - can be configured by admin
const defaultCreditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 25,
    price: 999, // in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 100,
    price: 2999,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 500,
    price: 9999,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },
];

class PaymentService {
  async getCreditPacks(): Promise<CreditPack[]> {
    // In production, fetch from database
    try {
      const dbPacks = await prisma.creditPack.findMany({
        where: { active: true },
        orderBy: { price: 'asc' },
      });

      if (dbPacks.length > 0) {
        return dbPacks.map((pack: any) => ({
          id: pack.id,
          name: pack.name,
          credits: pack.credits,
          price: Math.round(pack.price * 100), // Convert to cents
          priceId: pack.stripePriceId || '',
          popular: pack.popular,
        }));
      }
    } catch (error) {
      console.log('Using default credit packs');
    }

    return defaultCreditPacks;
  }

  async createCheckoutSession(
    userId: string,
    packId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    const packs = await this.getCreditPacks();
    const pack = packs.find(p => p.id === packId);

    if (!pack) {
      throw new Error('Credit pack not found');
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
              description: `${pack.credits} AI generation credits`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        packId: pack.id,
        credits: pack.credits.toString(),
      },
    });

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  }

  async handleWebhook(
    payload: Buffer,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleSuccessfulPayment(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true, message: 'Webhook processed' };
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<void> {
    const { userId, packId, credits } = session.metadata || {};

    if (!userId || !credits) {
      console.error('Missing metadata in checkout session');
      return;
    }

    const creditsToAdd = parseInt(credits, 10);

    // Add credits to user
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user credits
      await tx.userCredits.upsert({
        where: { userId },
        create: {
          userId,
          balance: creditsToAdd,
          totalPurchased: creditsToAdd,
          totalUsed: 0,
        },
        update: {
          balance: { increment: creditsToAdd },
          totalPurchased: { increment: creditsToAdd },
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          userId,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          status: 'COMPLETED',
          stripePaymentId: session.payment_intent as string,
          creditPackId: packId || null,
        },
      });

      // Log credit usage
      await tx.creditUsage.create({
        data: {
          userId,
          credits: creditsToAdd,
          action: 'PURCHASE',
          description: `Purchased ${creditsToAdd} credits`,
        },
      });
    });

    console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
  }

  async getUserCredits(userId: string): Promise<{
    balance: number;
    totalPurchased: number;
    totalUsed: number;
  }> {
    const credits = await prisma.userCredits.findUnique({
      where: { userId },
    });

    return {
      balance: credits?.balance || 0,
      totalPurchased: credits?.totalPurchased || 0,
      totalUsed: credits?.totalUsed || 0,
    };
  }

  async deductCredits(
    userId: string,
    amount: number,
    action: string,
    documentId?: string
  ): Promise<boolean> {
    const credits = await prisma.userCredits.findUnique({
      where: { userId },
    });

    if (!credits || credits.balance < amount) {
      return false;
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.userCredits.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
          totalUsed: { increment: amount },
        },
      });

      await tx.creditUsage.create({
        data: {
          userId,
          credits: -amount,
          action,
          documentId,
          description: `Used ${amount} credit(s) for ${action}`,
        },
      });
    });

    return true;
  }

  async getPaymentHistory(userId: string): Promise<any[]> {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async redeemPromoCode(
    userId: string,
    code: string
  ): Promise<{ success: boolean; credits?: number; message: string }> {
    const promoCode = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
    });

    if (!promoCode) {
      return { success: false, message: 'Invalid or expired promo code' };
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return { success: false, message: 'Promo code has reached maximum uses' };
    }

    // Check if user already used this code
    const alreadyUsed = await prisma.promoCodeUsage.findFirst({
      where: {
        promoCodeId: promoCode.id,
        userId,
      },
    });

    if (alreadyUsed) {
      return { success: false, message: 'You have already used this promo code' };
    }

    // Apply promo code
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Add credits
      if (promoCode.credits > 0) {
        await tx.userCredits.upsert({
          where: { userId },
          create: {
            userId,
            balance: promoCode.credits,
            totalPurchased: promoCode.credits,
            totalUsed: 0,
          },
          update: {
            balance: { increment: promoCode.credits },
            totalPurchased: { increment: promoCode.credits },
          },
        });
      }

      // Record usage
      await tx.promoCodeUsage.create({
        data: {
          promoCodeId: promoCode.id,
          userId,
        },
      });

      // Increment used count
      await tx.promoCode.update({
        where: { id: promoCode.id },
        data: { usedCount: { increment: 1 } },
      });

      // Log credit usage
      await tx.creditUsage.create({
        data: {
          userId,
          credits: promoCode.credits,
          action: 'PROMO_CODE',
          description: `Redeemed promo code: ${promoCode.code}`,
        },
      });
    });

    return {
      success: true,
      credits: promoCode.credits,
      message: `Successfully redeemed! ${promoCode.credits} credits added to your account.`,
    };
  }
}

export const paymentService = new PaymentService();
