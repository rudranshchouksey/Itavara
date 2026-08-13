import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Public webhook route (it will handle its own signature verification if needed)
router.post('/webhook', MediaController.handleWebhook);

// Secure upload routes
router.use(authGuard);

router.post('/upload-url', MediaController.getUploadUrl);

export default router;
