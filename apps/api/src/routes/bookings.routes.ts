import { Router } from 'express';
import { calculateQuote, createBooking } from '../controllers/bookings.controller';
import { authGuard } from '../middleware/authGuard';
import { bookingLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authGuard);
router.use(bookingLimiter);
router.post('/calculate-quote', calculateQuote);
router.post('/create', createBooking);

export default router;
