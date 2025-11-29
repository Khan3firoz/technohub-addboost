import { Router } from 'express';
import { body } from 'express-validator';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/job.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const jobValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('department')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department must be between 1 and 100 characters'),
  body('location')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters'),
  body('experience')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Experience must be between 1 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('responsibilities')
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('requirements')
    .isArray()
    .withMessage('Requirements must be an array'),
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed')
];

// Routes - Public read (open jobs only), Admin/Manager write access
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(jobValidation),
  createJob
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(jobValidation),
  updateJob
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deleteJob
);

export default router;

