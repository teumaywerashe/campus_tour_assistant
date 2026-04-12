import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    error: message,
  });
};
