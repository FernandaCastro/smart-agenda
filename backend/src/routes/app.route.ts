import { Router } from 'express';
import * as aiController from '../ai/ai.controller';
import * as taskController from '../task/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/ai/analyse', authenticateToken, aiController.analyseAndExecute);
router.post('/tasks', authenticateToken, taskController.createTask);
router.get('/tasks', authenticateToken, taskController.listTasks);
router.put('/tasks', authenticateToken, taskController.updateTask);
router.delete('/tasks/:taskId', authenticateToken, taskController.deleteTask);

export default router;
