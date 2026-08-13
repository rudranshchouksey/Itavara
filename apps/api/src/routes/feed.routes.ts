import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Assuming feeds are only for authenticated users based on standard social apps
// If public access is allowed, you can remove authGuard or make it optional.
router.use(authGuard);

router.get('/reels', FeedController.getReels);

export default router;
