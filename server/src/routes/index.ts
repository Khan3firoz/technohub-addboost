import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import campaignRoutes from './campaign.routes';
import analyticsRoutes from './analytics.routes';
import budgetRoutes from './budget.routes';
import mediaRoutes from './media.routes';
import serviceRoutes from './service.routes';
import teamMemberRoutes from './teamMember.routes';
import portfolioItemRoutes from './portfolioItem.routes';
import testimonialRoutes from './testimonial.routes';
import jobRoutes from './job.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/budget', budgetRoutes);
router.use('/media', mediaRoutes);
router.use('/services', serviceRoutes);
router.use('/team', teamMemberRoutes);
router.use('/portfolio', portfolioItemRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/jobs', jobRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

