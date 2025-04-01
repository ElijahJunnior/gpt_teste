import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";

import { AppError } from "@shared/errors/AppError";

export async function errorHandleMiddleware(
  err: Error,
  req: Request,
  res: Response,
  nxt: NextFunction
): Promise<Response> {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(422).json({
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    message: `Internal server error - ${err.message}`,
  });
}
