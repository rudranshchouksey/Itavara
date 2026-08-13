import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Public routes
router.get('/mini-blog/:id', PostsController.getMiniBlog);

// Protected routes
router.use(authGuard);
router.post('/mini-blog', PostsController.createMiniBlog);

export default router;
