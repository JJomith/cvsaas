import { Router } from 'express';
import {
  getCreditBalance,
  getCreditHistory,
  createCheckoutSession,
  handleWebhook,
  applyPromoCode,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware';
import express from 'express';

const router = Router();

// Webhook endpoint (needs raw body, no authentication)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.get('/credits', authenticate, getCreditBalance);
router.get('/credits/history', authenticate, getCreditHistory);
router.post('/checkout', authenticate, createCheckoutSession);
router.post('/promo-code', authenticate, applyPromoCode);

export default router;
