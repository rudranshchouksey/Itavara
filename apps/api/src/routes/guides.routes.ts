import { Router } from 'express';
import { searchGuides, hireGuide } from '../controllers/guides.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/search', searchGuides);
router.post('/hire', authGuard, hireGuide);

export default router;
