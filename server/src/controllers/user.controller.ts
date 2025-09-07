// controllers/user.controller.ts
import { Request, Response, NextFunction } from "express";
import { AppError, asyncHandler } from "../middleware/error.middleware";
import User, { IUser } from "../models/User.model";
import bcrypt from "bcryptjs";

// Interface for authenticated request (after auth middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Get all users (Admin only)
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 🔹 Query parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const sortColumn = (req.query.sortColumn as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // 🔹 Build query
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🔹 Count first
    const totalUsers = await User.countDocuments(query);

    // 🔹 Fetch users
    const users = await User.find(query)
      .select("-password")
      .sort({ [sortColumn]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(); // return plain JS objects

    // 🔹 Map _id → id
    const usersWithId = users.map((u) => ({
      ...u,
      id: u._id.toString(),
    }));

    // 🔹 Pagination info
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: usersWithId,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
          sortColumn,
          sortOrder: sortOrder === 1 ? "asc" : "desc",
        },
      },
    });
  }
);

// Get user by ID
export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  }
);

// Get current user profile
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user },
    });
  }
);

// Update current user profile
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { name, email, avatar } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }
    }

    // Update allowed fields only
    const updateFields: Partial<IUser> = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new AppError("Please provide all required fields", 400));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new AppError("New passwords do not match", 400));
    }

    if (newPassword.length < 6) {
      return next(
        new AppError("New password must be at least 6 characters long", 400)
      );
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Verify current password
    const isCurrentPasswordCorrect =
      await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return next(new AppError("Current password is incorrect", 400));
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);

// Create user (Admin only)
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, role, avatar } = req.body;

    // Validate required fields
    if (!name || !email) {
      return next(new AppError("Name and email are required", 400));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password: "P@ssw0rd",
      role: role || "user",
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  }
);

// Update user by ID (Admin only)
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;

    // Prevent password update through this route
    if (updates.password) {
      return next(
        new AppError("Password cannot be updated through this route", 400)
      );
    }

    // Check if email is being changed and if it already exists
    if (updates.email) {
      const emailExists = await User.findOne({
        email: updates.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  }
);

// Delete user account (current user)
export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!password) {
      return next(
        new AppError("Please provide your password to confirm deletion", 400)
      );
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError("Incorrect password", 400));
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

// Delete user by ID (Admin only)
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

// Get user statistics (Admin only)
export const getUserStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalAdmins: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
          totalRegularUsers: {
            $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
          },
          verifiedUsers: {
            $sum: { $cond: ["$isEmailVerified", 1, 0] },
          },
          unverifiedUsers: {
            $sum: { $cond: [{ $not: "$isEmailVerified" }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalUsers: 0,
          totalAdmins: 0,
          totalRegularUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
        },
        monthlyRegistrations: monthlyStats,
      },
    });
  }
);

// Toggle user status (Admin only)
export const toggleUserStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return next(new AppError("Please provide a valid status", 400));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: { user },
    });
  }
);
