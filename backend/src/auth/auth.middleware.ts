import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PublicUser } from "../user/user.model";

const JWT_SECRET= process.env.JWT_SECRET || "jwt_secret";

export interface AuthenticatedRequest extends Request {
    user?: PublicUser; 
  }

export function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded as PublicUser;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }