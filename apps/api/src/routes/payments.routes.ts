import { Router } from 'express';
import { initiatePayment, verifyPayment } from '../controllers/payments.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Protected route to initiate a payment from the client
router.post('/initiate', authGuard, initiatePayment);

// Public route for payment gateway webhooks
router.post('/verify', verifyPayment);

export default router;
