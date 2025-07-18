import { Router } from 'express';
import * as taskController from '../controllers/task.controllers.js';

const router = Router();

// router.get('/', taskController.listTasks);
// router.post('/', taskController.createTask);
// router.patch('/:id', taskController.updateTask);
router.post('/analyse', taskController.analyse);

export default router;
