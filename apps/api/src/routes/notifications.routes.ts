import { Router } from 'express';
import { getNotifications, updatePreferences, markAsRead } from '../controllers/notifications.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.use(authGuard);

router.get('/', getNotifications);
router.patch('/preferences', updatePreferences);
router.patch('/:id/read', markAsRead);

export default router;
