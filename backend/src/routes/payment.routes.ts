import { Router } from 'express';
import {
  getCredits,
  getPaymentHistory,
  createCheckout,
  handleWebhook,
  redeemPromoCode,
  getCreditPacks,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware';
import express from 'express';

const router = Router();

// Webhook endpoint (needs raw body, no authentication)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.get('/credits', authenticate, getCredits);
router.get('/credits/history', authenticate, getPaymentHistory);
router.get('/credit-packs', getCreditPacks);
router.post('/checkout', authenticate, createCheckout);
router.post('/promo-code', authenticate, redeemPromoCode);

export default router;
