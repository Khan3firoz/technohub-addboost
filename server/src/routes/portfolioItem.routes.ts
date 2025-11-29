import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolioItem.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const portfolioItemValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('client')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Client name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('result')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Result must be between 1 and 500 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Routes - Public read access, Admin/Manager write access
router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItemById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(portfolioItemValidation),
  createPortfolioItem
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(portfolioItemValidation),
  updatePortfolioItem
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deletePortfolioItem
);

export default router;

