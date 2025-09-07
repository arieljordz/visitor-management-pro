// middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Custom Error Class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  stack?: string;
}

// MongoDB Cast Error Handler
const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// MongoDB Duplicate Field Error Handler
const handleDuplicateFieldsDB = (err: any): AppError => {
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];
  const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} '${duplicateValue}' already exists`;
  return new AppError(message, 400);
};

// MongoDB Validation Error Handler
const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// JWT Error Handlers
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired. Please log in again", 401);

// Send Error Response in Development
const sendErrorDev = (err: AppError, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: err.name,
    message: err.message,
    stack: err.stack,
  };

  res.status(err.statusCode || 500).json(errorResponse);
};

// Send Error Response in Production
const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: "Error",
      message: err.message,
    };

    res.status(err.statusCode).json(errorResponse);
  } else {
    console.error("ERROR 💥:", err);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Error",
      message: "Something went wrong!",
    };

    res.status(500).json(errorResponse);
  }
};

// Main Error Handling Middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: any = err;

  // Log error to console for debugging
  console.error("Error Handler:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Set default status code if not set
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  // Mongoose bad ObjectId (CastError)
  if (err instanceof mongoose.Error.CastError) {
    error = handleCastErrorDB(err);
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    error = handleValidationErrorDB(err);
  }

  // JWT invalid signature
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  // Express validator errors
  if (err.errors && Array.isArray(err.errors)) {
    const messages = err.errors.map((e: any) => e.msg);
    error = new AppError(`Validation Error: ${messages.join(". ")}`, 400);
  }

  // Handle specific HTTP errors
  if (err.type === "entity.parse.failed") {
    error = new AppError("Invalid JSON format", 400);
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    error = new AppError("File too large", 400);
  }

  if (err.status === 429) {
    error = new AppError("Too many requests, please try again later", 429);
  }

  // Send error response based on environment
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 Not Found Handler
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async Error Handler Wrapper
const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export { errorHandler, notFound, asyncHandler };
