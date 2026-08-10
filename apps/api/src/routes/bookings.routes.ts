import { Router } from 'express';
import { calculateQuote, createBooking } from '../controllers/bookings.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/calculate-quote', calculateQuote);
router.post('/create', authGuard, createBooking);

export default router;
