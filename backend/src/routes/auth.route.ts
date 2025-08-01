import { Router } from 'express';
import * as authController from '../auth/auth.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/session', authenticateToken, authController.getSession);


export default router;