import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error.stack);
  next(error);
};
