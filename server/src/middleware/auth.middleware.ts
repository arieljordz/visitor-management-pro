// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from './error.middleware';
import User from '../models/User.model';

// Interface for authenticated request
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

// Interface for JWT payload
interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

// Protect routes - verify JWT access token
export const protect = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Access denied. No token provided', 401));
  }

  try {
    // Verify access token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variablesss');
    }

    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // Check if user is active (if you have this field in your model)
    // if (user.isActive === false) {
    //   return next(new AppError('Your account has been deactivated', 401));
    // }

    // Grant access to protected route
    req.user = {
      id: user.id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid access token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Access token has expired', 401));
    } else {
      return next(new AppError('Token verification failed', 401));
    }
  }
});

// Restrict to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = {
          id: user.id.toString(),
          role: user.role,
          name: user.name,
          email: user.email,
        };
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error
      // Just continue without user info
    }
  }

  next();
});