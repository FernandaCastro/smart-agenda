import { Router } from 'express';
import * as taskController from '../task/task.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';

const router = Router();

router.post('/analyse', authenticateToken, taskController.analyse);

export default router;
