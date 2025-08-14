import { Response } from 'express';
import * as taskService from './task.service';
import { AppError } from '../error/error.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { FilterCriteria, Task } from './task.model';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.body) throw new AppError(400, 'Task is not present.');
        if (!req.user || !req.user.id) throw new AppError(401, 'User is not identified.');

        const task = req.body as Task;
        const userId = req.user.id;

        const newTask = await taskService.createTask(userId, task);
        const message: string = `Task '${newTask.title}' created successfully.`;
        return res.status(201).json({ message, result: newTask });

    } catch (error) {
        console.error('Error creating task:', error);

        if (error instanceof AppError) {
            const appError = (error as AppError);
            res.statusMessage = appError.message;
            return res.status(appError.statusCode).json(appError);
        }

        return res.status(500).json(error);
    }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.body) throw new AppError(400, 'Task is not present.');
        if (!req.user || !req.user.id) throw new AppError(401, 'User is not identified.');

        const task = req.body as Task;
        const userId = req.user.id;

        const updatedTask = await taskService.updateTask(userId, task);

        const message: string = `Task '${updatedTask.title}' updated successfully.`;
        return res.status(200).json({ message, result: updatedTask });

    } catch (error) {
        console.error('Error updating task:', error);

        if (error instanceof AppError) {
            const appError = (error as AppError);
            res.statusMessage = appError.message;
            return res.status(appError.statusCode).json(appError);
        }

        return res.status(500).json(error);
    }
}

export const listTasks = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.query) throw new AppError(400, 'Criteria filter is not present.');
        if (!req.user || !req.user.id) throw new AppError(401, 'User is not identified.');

        const criteria = req.query as Partial<FilterCriteria>;
        const userId = req.user.id;

        const tasks = await taskService.retrieveTasks(userId, criteria);

        const message: string = (!tasks || tasks.length > 0) ?
            `Found ${tasks.length} task(s).` :
            `No tasks found.`

        return res.status(200).json({ message, result: tasks });

    } catch (error) {
        console.error('Error creating task:', error);

        if (error instanceof AppError) {
            const appError = (error as AppError);
            res.statusMessage = appError.message;
            return res.status(appError.statusCode).json(appError);
        }

        return res.status(500).json(error);
    }
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.query || !req.query.taskId) throw new AppError(400, 'TaskId is not present.');
        if (!req.user || !req.user.id) throw new AppError(401, 'User is not identified.');

        const taskId = req.query.taskId as string;
        const userId = req.user.id;

        await taskService.deleteTask(userId, taskId);

        const message: string = `Task ${taskId} was deleted.`;
        return res.status(200).json({ message, result: {} });

    } catch (error) {
        console.error('Error creating task:', error);

        if (error instanceof AppError) {
            const appError = (error as AppError);
            res.statusMessage = appError.message;
            return res.status(appError.statusCode).json(appError);
        }

        return res.status(500).json(error);
    }
}