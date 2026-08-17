import { Router } from 'express';
import { getPrivacySettings, updatePrivacySettings, blockUser, muteUser, unblockUser, unmuteUser } from '../controllers/privacy.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.use(authGuard);

router.get('/', getPrivacySettings);
router.patch('/', updatePrivacySettings);
router.post('/block-user', blockUser);
router.post('/mute-user', muteUser);
router.delete('/block-user/:id', unblockUser);
router.delete('/mute-user/:id', unmuteUser);

export default router;
