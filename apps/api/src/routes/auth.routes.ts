import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/oauth/google', AuthController.googleOAuth);

// Note: WebAuthn routes would go here as well, 
// e.g., router.get('/webauthn/generate-registration-options', AuthController.generateWebAuthnRegistration);
// e.g., router.post('/webauthn/verify-registration', AuthController.verifyWebAuthnRegistration);
// e.g., router.get('/webauthn/generate-authentication-options', AuthController.generateWebAuthnAuth);
// e.g., router.post('/webauthn/verify-authentication', AuthController.verifyWebAuthnAuth);
// They are stubbed as per phase plan, full implementation can be added in subsequent steps.

export default router;
