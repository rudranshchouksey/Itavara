import { Router } from 'express';
import { createListing, searchListings, getFlexibleListings } from '../controllers/listings.controller';
import { authGuard } from '../middleware/authGuard';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = Router();

router.post('/create', authGuard, createListing);
router.post('/search', cacheMiddleware(600), searchListings); // 10 mins cache
router.get('/flexible', getFlexibleListings);

export default router;
