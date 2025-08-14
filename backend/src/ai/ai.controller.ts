import { Response } from 'express';
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AppError } from "../error/error.model";
import { OpenAIService } from "./openai.service";

export const analyseAndExecute = async (req: AuthenticatedRequest, res: Response) => {

  if (!req.body || !req.body.text) throw new AppError(400, 'Text is not present.');
  if (!req.user || !req.user.id) throw new AppError(401, 'User is not identified.');

  try {

    const text = req.body.text;
    const userId = req.user.id;
    const timezone = req.userTimezone || 'UTC';

    const result = await OpenAIService.analyseAndExecute(req, userId, text, timezone);
    console.log('response:', result);
    return res.status(200).json(result);

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