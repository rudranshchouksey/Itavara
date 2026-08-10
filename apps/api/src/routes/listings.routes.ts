import { Router } from 'express';
import { createListing, searchListings } from '../controllers/listings.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/create', authGuard, createListing);
router.post('/search', searchListings);

export default router;
