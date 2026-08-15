import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// All user routes require authentication
router.use(authGuard);

router.patch('/switch-role', UserController.switchRole);
router.patch('/profile', UserController.updateProfile);
router.get('/profile/posts', UserController.getProfilePosts);

export default router;
