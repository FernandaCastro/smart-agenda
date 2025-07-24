import { Response } from 'express';
import { analyseText } from './task.service.js';
import { AppError } from '../error/error.model.js';
import { AuthenticatedRequest } from '../auth/auth.middleware.js';

export const analyse = async (req: AuthenticatedRequest, res: Response) => {

  try {

    if (!req.body || !req.body.text) throw new AppError(400, 'Text is not present.');
    if (!req.user) throw new AppError(401, 'User is not authenticated.');

    const text = req.body.text;
    const user = req.user;

    const task = await analyseText(req.user.id, text);
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
