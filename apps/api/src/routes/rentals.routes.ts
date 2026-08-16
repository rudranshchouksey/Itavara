import { Router } from 'express';
import { getRentals, bookRental } from '../controllers/rentals.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/', getRentals);
router.post('/book', authGuard, bookRental);

export default router;
