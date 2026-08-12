import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const message = error instanceof Error ? error.message : "Unknown error";

  const isConnectivityError =
    /connect|routing|ServiceUnavailable|SessionExpired|auth/i.test(message);

  console.error("[error]", message);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
    });

    return;
  }

  res.status(isConnectivityError ? 503 : 500).json({
    error: isConnectivityError
      ? "Could not reach the graph database. Please try again shortly."
      : "Something went wrong handling that request.",
  });
};
