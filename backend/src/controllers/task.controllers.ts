import { Request, Response } from 'express';
import { process } from '../services/task.services';
import { AppError } from '../models/error.models';

// export const listTasks = (_req: Request, res: Response) => {
//   const tasks = list();
//   res.json(tasks);
// };

// export const createTask = (req: Request, res: Response) => {
//   const newTask = create(req.body);
//   res.status(201).json(newTask);
// };

// export const updateTask = (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedTask = update(id, req.body);
//   res.json(updatedTask);
// };


export const analyse = async (req: Request, res: Response) => {

  try {

    if (!req.body || !req.body.text) throw new AppError(400, 'Text is not present.');

    const task = await process(req.body.text);
    return res.json(task);

  } catch (error) {
    console.error('Error analysing text:', error);

    if (error instanceof AppError) {
      const appError = (error as AppError);
      res.statusMessage = appError.message;
      return res.status(appError.statusCode).json(appError);
    }

    return res.status(500).json(error);
  }
};
