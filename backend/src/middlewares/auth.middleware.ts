import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PublicUser } from "../user/user.model";
import { AppError } from "../error/error.model";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {

  let token: string | undefined;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader?.split(" ")[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) throw new AppError(401, "No token provided");

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded as PublicUser;
    next();
  } catch (err) {
    throw new AppError(403, "Invalid token");
  }
}