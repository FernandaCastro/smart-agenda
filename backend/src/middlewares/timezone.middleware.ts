import { NextFunction, Request, Response } from "express";
import { isValidTimezone } from "../utils/timezone";


export function timezoneMiddleware(req: Request, res: Response, next: NextFunction) {

    const tz = req.headers['x-timezone'];
    const timezone = (tz && !Array.isArray(tz)) ? tz.toString() : "";

    req.userTimezone = isValidTimezone(timezone) ? timezone : 'UTC';

    next();
}