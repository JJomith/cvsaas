import express, { Request } from 'express';
import { paymentService } from '../../services/payment';
import { authenticate } from '../../middleware/auth';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const router = express.Router();

// Get available credit packs
router.get('/credit-packs', async (req, res) => {
  try {
    const packs = await paymentService.getCreditPacks();
    res.json(packs);
  } catch (error) {
    console.error('Get credit packs error:', error);
    res.status(500).json({ error: 'Failed to fetch credit packs' });
  }
});

// Create checkout session (requires authentication)
router.post('/create-checkout', authenticate, async (req: AuthRequest, res) => {
  try {
    const { packId, successUrl, cancelUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!packId) {
      return res.status(400).json({ error: 'Credit pack ID is required' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const session = await paymentService.createCheckoutSession(
      userId,
      packId,
      successUrl || `${frontendUrl}/payment/success`,
      cancelUrl || `${frontendUrl}/pricing`
    );

    res.json(session);
  } catch (error: any) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Stripe webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
      const result = await paymentService.handleWebhook(req.body, signature);
      res.json(result);
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Get user credits (requires authentication)
router.get('/credits', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const credits = await paymentService.getUserCredits(userId);
    res.json(credits);
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Get payment history (requires authentication)
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const history = await paymentService.getPaymentHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Redeem promo code (requires authentication)
router.post('/redeem-promo', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const result = await paymentService.redeemPromoCode(userId, code);
    
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json(result);
  } catch (error) {
    console.error('Redeem promo error:', error);
    res.status(500).json({ error: 'Failed to redeem promo code' });
  }
});

export default router;
