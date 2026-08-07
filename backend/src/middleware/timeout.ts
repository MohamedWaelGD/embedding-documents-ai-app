import { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCode } from '../models/errors';

export function timeoutMiddleware(timeoutMs: number) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.setTimeout(timeoutMs, () => {
      next(new AppError(ErrorCode.TIMEOUT, 'Request timed out', 408));
    });
    next();
  };
}
