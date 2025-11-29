import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/teamMember.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const teamMemberValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must be between 1 and 100 characters'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('bio')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Bio must be between 1 and 500 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Routes - Public read access, Admin/Manager write access
router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);
router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(teamMemberValidation),
  createTeamMember
);
router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(teamMemberValidation),
  updateTeamMember
);
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deleteTeamMember
);

export default router;

