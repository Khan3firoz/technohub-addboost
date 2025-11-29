import { Router } from 'express';
import { body } from 'express-validator';
import {
  setBudget,
  getBudget,
  updateBudget,
  trackSpending,
  getBudgetHistory
} from '../controllers/budget.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// All budget routes require authentication
router.use(authenticate);

// Validation rules
const budgetValidation = [
  body('totalBudget')
    .isFloat({ min: 0 })
    .withMessage('Total budget must be a positive number'),
  body('dailyBudget')
    .isFloat({ min: 0 })
    .withMessage('Daily budget must be a positive number')
];

const trackSpendingValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// Routes
router.post(
  '/campaigns/:campaignId',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(budgetValidation),
  setBudget
);
router.get('/campaigns/:campaignId', getBudget);
router.put(
  '/campaigns/:campaignId',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(budgetValidation),
  updateBudget
);
router.post(
  '/campaigns/:campaignId/spend',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(trackSpendingValidation),
  trackSpending
);
router.get('/campaigns/:campaignId/history', getBudgetHistory);

export default router;

