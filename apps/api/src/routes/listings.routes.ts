import { Router } from 'express';
import { createListing, searchListings, getFlexibleListings } from '../controllers/listings.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/create', authGuard, createListing);
router.post('/search', searchListings);
router.get('/flexible', getFlexibleListings);

export default router;
