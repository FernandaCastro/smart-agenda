import { Request, Response } from 'express';
import { AppError } from "../error/error.model.js";
import { processLogin, processSignup } from "./auth.service.js";

export const signup = async (req: Request, res: Response) => {

  try {

    if (!req.body || !req.body.user) throw new AppError(400, 'User is not present.');

    const result = await processSignup(req.body.user);
    return res.status(200).json(result.toPublicJSON());

  } catch (error) {
    console.error('Error signing up:', error);

    if (error instanceof AppError) {
      const appError = (error as AppError);
      res.statusMessage = appError.message;
      return res.status(appError.statusCode).json(appError);
    }

    return res.status(500).json('Signup failed');
  }
};


export const login = async (req: Request, res: Response) => {

  if (!req.body || !req.body.user) throw new AppError(400, 'User is not present.');

  try {

    const token = await processLogin(req.body.user);
    return res.status(200).json(token);

  } catch (error) {
    console.error('Error logging in:', error);

    if (error instanceof AppError) {
      const appError = (error as AppError);
      res.statusMessage = appError.message;
      return res.status(appError.statusCode).json(appError);
    }

    return res.status(500).json('Login failed');
  }

}