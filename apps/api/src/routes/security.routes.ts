import { Router } from 'express';
import { setup2FA, verify2FA, getSessions, terminateSession, terminateAllOtherSessions } from '../controllers/security.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.use(authGuard);

router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FA);
router.get('/sessions', getSessions);
router.delete('/sessions/other', terminateAllOtherSessions);
router.delete('/sessions/:sessionId', terminateSession);

export default router;
