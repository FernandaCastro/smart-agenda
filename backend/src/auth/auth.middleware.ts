import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PublicUser } from "../user/user.model.js";

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

  if (!token ) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded as PublicUser;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}