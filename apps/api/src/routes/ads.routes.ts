import { Router } from 'express';
import { getFeedAds, trackInteraction } from '../controllers/ads.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/feed', getFeedAds);
router.post('/interaction', authGuard, trackInteraction);

export default router;
