import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialVisibility,
  deleteTestimonial
} from '../controllers/testimonial.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const testimonialValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must be between 1 and 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company must be between 1 and 100 characters'),
  body('feedback')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Feedback must be between 1 and 1000 characters'),
  body('avatar')
    .trim()
    .notEmpty()
    .withMessage('Avatar URL is required'),
  body('visible')
    .optional()
    .isBoolean()
    .withMessage('Visible must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Routes - Public read (visible only), Admin/Manager write access
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(testimonialValidation),
  createTestimonial
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(testimonialValidation),
  updateTestimonial
);
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  toggleTestimonialVisibility
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deleteTestimonial
);

export default router;

