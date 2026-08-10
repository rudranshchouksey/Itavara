import { Router } from 'express';
import { createListing } from '../controllers/listings.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/create', authGuard, createListing);

export default router;
