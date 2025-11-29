import { Router } from 'express';
import { body } from 'express-validator';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  pauseCampaign,
  activateCampaign,
  assignClients
} from '../controllers/campaign.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// All campaign routes require authentication
router.use(authenticate);

// Validation rules
const campaignValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Campaign name must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('type')
    .isIn(['banner', 'video', 'social'])
    .withMessage('Type must be banner, video, or social'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('targetAudience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Target audience description cannot exceed 500 characters')
];

const assignClientsValidation = [
  body('clientIds')
    .isArray()
    .withMessage('Client IDs must be an array')
    .notEmpty()
    .withMessage('At least one client ID is required')
];

// Routes
router.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(campaignValidation),
  createCampaign
);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(campaignValidation),
  updateCampaign
);
router.delete(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  deleteCampaign
);
router.patch(
  '/:id/pause',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  pauseCampaign
);
router.patch(
  '/:id/activate',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  activateCampaign
);
router.patch(
  '/:id/assign',
  requireRole(UserRole.ADMIN, UserRole.CAMPAIGN_MANAGER),
  validate(assignClientsValidation),
  assignClients
);

export default router;

