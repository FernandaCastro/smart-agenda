import { Request, Response } from 'express';
import { AppError } from "../error/error.model.js";
import { processLogin, processRefreshToken, processSignup } from "./auth.service.js";
import {AuthenticatedRequest} from "./auth.middleware.js";

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

    const { publicUser, accessToken, refreshToken } = await processLogin(req.body.user);

    // Cookie HttpOnly to Web
    res.cookie('accessToken', accessToken, generateAccessCookie(accessToken));

    // refreshToken as httpOnly cookie 
    res.cookie('refreshToken', generateRefreshCookie(refreshToken));

    //To mobile only
    res.status(200).json({ publicUser });

  } catch (error) {
    console.error('Error logging in:', error);

    if (error instanceof AppError) {
      const appError = (error as AppError);
      res.statusMessage = appError.message;
      return res.status(appError.statusCode).json(appError);
    }

    res.status(500).json('Login failed');
  }

}

export const refreshToken = async (req: Request, res: Response) => {

  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token sent!' });

  try {

    const { newAccessToken, newRefreshToken } = await processRefreshToken(refreshToken);

    // accessToken as httpOnly cookie
    res.cookie('accessToken', newAccessToken, generateAccessCookie(newAccessToken));

    // refreshToken as httpOnly cookie 
    res.cookie('refreshToken', newRefreshToken, generateRefreshCookie(newRefreshToken));


    res.status(200).json({ newAccessToken: newAccessToken, newRefreshToken: newRefreshToken }); // to mobile

  } catch (error) {
    console.error('Error refreshing tokens:', error);

    if (error instanceof AppError) {
      const appError = (error as AppError);
      res.statusMessage = appError.message;
      return res.status(appError.statusCode).json(appError);
    }

    res.status(500).json('RefreshToken failed');
  }

}

export const getSession = async (req: AuthenticatedRequest, res: Response) => {

  if (!req || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { id, name, email } = req.user;
  const publicUser = { id, name, email };

  return res.status(200).json({ publicUser });
};

function generateAccessCookie(accessToken: string): {} {
  return {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    value: accessToken,
  };
}

function generateRefreshCookie(refreshToken: string): {} {
  return {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    value: refreshToken,
  };
}