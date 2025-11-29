import { Router } from 'express';
import { uploadMedia, getMedia, deleteMedia, getMediaByCampaign } from '../controllers/media.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../utils/upload.util';

const router = Router();

// All media routes require authentication
router.use(authenticate);

// Routes
router.post('/upload', upload.single('file'), uploadMedia);
router.get('/:id', getMedia);
router.delete('/:id', deleteMedia);
router.get('/campaigns/:campaignId', getMediaByCampaign);

export default router;

