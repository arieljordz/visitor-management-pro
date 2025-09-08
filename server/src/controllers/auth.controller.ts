import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User.model";
import { AppError, asyncHandler } from "../middleware/error.middleware";

// Extend Request interface for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

// Interface for JWT payload
interface TokenPayload extends JwtPayload {
  id: string;
}

// Sign access token
const signAccessToken = (id: string): string => {
  const payload = { id };
  const secret: Secret = process.env.JWT_SECRET as Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "15m") as any;
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

// Sign refresh token
const signRefreshToken = (id: string): string => {
  const payload = { id };
  const secret: Secret = process.env.JWT_REFRESH_SECRET as Secret;
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any;
  
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

// Send tokens to client
const sendTokens = (res: Response, user: IUser) => {
  const accessToken = signAccessToken(user.id.toString());
  const refreshToken = signRefreshToken(user.id.toString());

  // Store refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

// Format user data for response (exclude sensitive fields)
const formatUserResponse = (user: IUser) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Register user
export const register = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  const user = await User.create({ name, email, password });

  // 🚨 Don't log them in if not verified
  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email before logging in.",
    user: formatUserResponse(user),
  });
});

// Login user
export const login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  // 🚨 Check if email verified
  if (!user.isEmailVerified) {
    return next(new AppError("Please verify your email before logging in", 403));
  }

  const tokens = sendTokens(res, user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken: tokens.accessToken,
    user: formatUserResponse(user),
  });
});

// Get current user profile
export const getMe = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Not authorized", 401));
  }

  // Get fresh user data from database
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    user: formatUserResponse(user),
  });
});

// Refresh access token
export const refreshToken = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return next(new AppError("No refresh token provided", 401));
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    return next(new AppError("Refresh token secret not configured", 500));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, refreshSecret) as TokenPayload;
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Generate new access token
    const accessToken = signAccessToken(user.id.toString());

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    // Clear invalid refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    return next(new AppError("Invalid or expired refresh token", 401));
  }
});

// Logout user
export const logout = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Verify token (utility function for middleware)
export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  
  return jwt.verify(token, secret) as TokenPayload;
};

// Verify refresh token (utility function)
export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  
  return jwt.verify(token, secret) as TokenPayload;
};