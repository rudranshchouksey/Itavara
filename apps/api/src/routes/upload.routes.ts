import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Secure upload routes
router.use(authGuard);

router.post('/avatar-url', UploadController.getAvatarUploadUrl);

export default router;
