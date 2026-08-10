import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// All verification routes require authentication
router.use(authGuard);

router.post('/request', VerificationController.requestVerification);
router.get('/status', VerificationController.getStatus);

export default router;
