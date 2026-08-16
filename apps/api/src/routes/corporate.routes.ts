import { Router } from 'express';
import { createCorporateBooking, getInvoices } from '../controllers/corporate.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/bookings/create', authGuard, createCorporateBooking);
router.get('/invoices', authGuard, getInvoices);

export default router;
