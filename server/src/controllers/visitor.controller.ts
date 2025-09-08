// controllers/visitor.controller.ts
import { Request, Response, NextFunction } from "express";
import { AppError, asyncHandler } from "../middleware/error.middleware";
import Visitor from "../models/Visitor.model";
import type { AuthRequest } from "../types/auth.types";

// 📌 Get all visitors with pagination, search, sorting
export const getAllVisitors = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const sortColumn = (req.query.sortColumn as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // 🔹 Build query (search firstname, lastname, fullname, email, phone)
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const totalVisitors = await Visitor.countDocuments(query);

    const visitors = await Visitor.find(query)
      .populate("hostId", "firstname lastname email") // include host info
      .sort({ [sortColumn]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const visitorsWithId = visitors.map((v) => ({
      ...v,
      id: v._id.toString(),
    }));

    const totalPages = Math.ceil(totalVisitors / limit);

    res.status(200).json({
      success: true,
      message: "Visitors retrieved successfully",
      data: {
        visitors: visitorsWithId,
        pagination: {
          currentPage: page,
          totalPages,
          totalVisitors,
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

// 📌 Get visitor by ID
export const getVisitorById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const visitor = await Visitor.findById(id).populate(
      "hostId",
      "firstname lastname email"
    );

    if (!visitor) {
      return next(new AppError("Visitor not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Visitor retrieved successfully",
      data: { visitor },
    });
  }
);

// 📌 Create new visitor
export const createVisitor = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { firstname, middlename, lastname, email, phone, address, company } =
      req.body;

    const hostId = req.user?.id;

    if (!firstname || !lastname || !email || !phone || !address) {
      return next(new AppError("Missing required fields", 400));
    }

    // Check email uniqueness
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
      return next(new AppError("Email already in use", 400));
    }

    const visitor = await Visitor.create({
      firstname,
      middlename,
      lastname,
      email,
      phone,
      address,
      company,
      hostId,
    });

    res.status(201).json({
      success: true,
      message: "Visitor created successfully",
      data: { visitor },
    });
  }
);

// 📌 Update visitor
export const updateVisitor = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;

    // If email is being updated, ensure uniqueness
    if (updates.email) {
      const emailExists = await Visitor.findOne({
        email: updates.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }
    }

    const visitor = await Visitor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("hostId", "firstname lastname email");

    if (!visitor) {
      return next(new AppError("Visitor not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Visitor updated successfully",
      data: { visitor },
    });
  }
);

// 📌 Delete visitor
export const deleteVisitor = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const visitor = await Visitor.findByIdAndDelete(id);

    if (!visitor) {
      return next(new AppError("Visitor not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Visitor deleted successfully",
    });
  }
);

// 📌 Visitor statistics
export const getVisitorStats = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const stats = await Visitor.aggregate([
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: 1 },
          uniqueCompanies: { $addToSet: "$company" },
          uniqueHosts: { $addToSet: "$hostId" },
        },
      },
      {
        $project: {
          totalVisitors: 1,
          totalCompanies: { $size: "$uniqueCompanies" },
          totalHosts: { $size: "$uniqueHosts" },
        },
      },
    ]);

    const monthlyStats = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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
      message: "Visitor statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalVisitors: 0,
          totalCompanies: 0,
          totalHosts: 0,
        },
        monthlyRegistrations: monthlyStats,
      },
    });
  }
);
