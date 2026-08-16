import { Router } from 'express';
import { getMentors, requestSession } from '../controllers/superhosts.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/mentors', getMentors);
router.post('/request-session', authGuard, requestSession);

export default router;
