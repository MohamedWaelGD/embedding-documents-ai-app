import { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCode, isAppError } from '../models/errors';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(ErrorCode.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (isAppError(err)) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  console.error('Unhandled error:', err);

  const status =
    err && typeof err === 'object' && 'status' in err
      ? Number((err as { status: unknown }).status)
      : 0;
  const safeStatus = Number.isInteger(status) && status >= 400 && status < 600 ? status : 500;

  res.status(safeStatus).json({
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
    },
  });
}
