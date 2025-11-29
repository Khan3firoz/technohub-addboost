import { Router } from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/service.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const serviceValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon is required'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Routes - Public read access, Admin/Manager write access
router.get('/', getServices);
router.get('/:id', getServiceById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(serviceValidation),
  createService
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(serviceValidation),
  updateService
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deleteService
);

export default router;

