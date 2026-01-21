import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import documentRoutes from './document.routes';
import jobRoutes from './job.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/documents', documentRoutes);
router.use('/jobs', jobRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

export default router;
