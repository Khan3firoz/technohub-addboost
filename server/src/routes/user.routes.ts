import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Validation rules
const updateUserValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
];

const changeRoleValidation = [
  body('role')
    .isIn(['admin', 'campaign_manager', 'client', 'viewer'])
    .withMessage('Invalid role')
];

// Routes
router.get('/', requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER), getAllUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  requireRole(UserRole.ADMIN),
  validate(updateUserValidation),
  updateUser
);
router.delete('/:id', requireRole(UserRole.ADMIN), deleteUser);
router.patch(
  '/:id/role',
  requireRole(UserRole.ADMIN),
  validate(changeRoleValidation),
  changeRole
);

export default router;

