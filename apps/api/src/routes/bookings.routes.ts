import { Router } from 'express';
import { calculateQuote } from '../controllers/bookings.controller';

const router = Router();

router.post('/calculate-quote', calculateQuote);

export default router;
