import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  grantCredits,
  getAIProviders,
  updateAIProvider,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getSystemConfig,
  updateSystemConfig,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.post('/users/:id/credits', grantCredits);

// AI Providers
router.get('/ai-providers', getAIProviders);
router.put('/ai-providers/:id', updateAIProvider);

// Templates
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

// Promo Codes
router.get('/promo-codes', getPromoCodes);
router.post('/promo-codes', createPromoCode);
router.put('/promo-codes/:id', updatePromoCode);
router.delete('/promo-codes/:id', deletePromoCode);

// System Settings
router.get('/settings', getSystemConfig);
router.put('/settings', updateSystemConfig);

export default router;
