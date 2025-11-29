import { Router } from 'express';
import { body } from 'express-validator';
import {
  recordAnalytics,
  getCampaignAnalytics,
  getAggregatedStats,
  exportReport
} from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Validation rules
const analyticsValidation = [
  body('impressions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Impressions must be a positive integer'),
  body('clicks')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Clicks must be a positive integer'),
  body('conversions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Conversions must be a positive integer'),
  body('spend')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Spend must be a positive number'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
];

// Routes
router.post(
  '/campaigns/:campaignId',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(analyticsValidation),
  recordAnalytics
);
router.get('/campaigns/:campaignId', getCampaignAnalytics);
router.get('/campaigns/:campaignId/aggregate', getAggregatedStats);
router.get('/campaigns/:campaignId/export', exportReport);

export default router;

