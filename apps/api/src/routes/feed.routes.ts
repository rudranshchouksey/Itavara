import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';
import { authGuard } from '../middleware/authGuard';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { publicLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(publicLimiter);

// Assuming feeds are only for authenticated users based on standard social apps
// If public access is allowed, you can remove authGuard or make it optional.
router.use(authGuard);

router.get('/reels', FeedController.getReels);
router.get('/trending', cacheMiddleware(300), FeedController.getTrending); // 5 mins cache

export default router;
