import { Request, Response, NextFunction } from "express";
import { CustomException } from "./CustomException";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof CustomException) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
}
