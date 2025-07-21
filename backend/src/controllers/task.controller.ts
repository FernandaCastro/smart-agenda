import { Request, Response } from 'express';
import { process } from '../services/task.service.js';
import { AppError } from '../models/error.model.js';

export const analyse = async (req: Request, res: Response) => {

  try {

    if (!req.body || !req.body.text) throw new AppError(400, 'Text is not present.');

    const task = await process(req.body.text);
    console.log('response:', task);
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
