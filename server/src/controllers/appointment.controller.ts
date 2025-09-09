// controllers/appointment.controller.ts
import { Response, NextFunction } from "express";
import { AppError, asyncHandler } from "../middleware/error.middleware";
import Appointment from "../models/Appointment.model";
import type { AuthRequest } from "../types/auth.types";
import type { IAppointment } from "../types/appointment.types";

// 📌 Get all appointments with pagination, search, sorting
export const getAllAppointments = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const sortColumn = (req.query.sortColumn as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const query: Record<string, any> = {};

    // search across visitor fields
    if (search) {
      query.$or = [
        { "visitorId.firstname": { $regex: search, $options: "i" } },
        { "visitorId.lastname": { $regex: search, $options: "i" } },
        { "visitorId.fullname": { $regex: search, $options: "i" } },
        { "visitorId.email": { $regex: search, $options: "i" } },
        { "visitorId.phone": { $regex: search, $options: "i" } },
        { purpose: { $regex: search, $options: "i" } },
      ];
    }

    const totalAppointments = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate("visitorId", "firstname lastname fullname email phone company address")
      .populate("hostId", "name email") // host is a User
      .sort({ [sortColumn]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean<IAppointment[]>();

    const totalPages = Math.ceil(totalAppointments / limit);

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: {
        appointments,
        pagination: {
          currentPage: page,
          totalPages,
          totalAppointments,
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

// 📌 Get appointment by ID
export const getAppointmentById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("visitorId", "firstname lastname fullname email phone company address")
      .populate("hostId", "name email");

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Appointment retrieved successfully",
      data: appointment,
    });
  }
);

// 📌 Create new appointment
export const createAppointment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { visitorId, purpose, visitDate } = req.body;
    const hostId = req.user?.id;

    if (!visitorId || !purpose || !visitDate) {
      return next(new AppError("Missing required fields", 400));
    }

    const appointment = await Appointment.create({
      visitorId,
      hostId,
      purpose,
      visitDate,
      status: "pending", // default
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  }
);

// 📌 Update appointment
export const updateAppointment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("visitorId", "firstname lastname fullname email phone")
      .populate("hostId", "name email");

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  }
);

// 📌 Delete appointment
export const deleteAppointment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  }
);

// 📌 Appointment statistics
export const getAppointmentStats = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
          uniqueHosts: { $addToSet: "$hostId" },
        },
      },
      {
        $project: {
          totalAppointments: 1,
          totalVisitors: { $size: "$uniqueVisitors" },
          totalHosts: { $size: "$uniqueHosts" },
        },
      },
    ]);

    const monthlyStats = await Appointment.aggregate([
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
      message: "Appointment statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalAppointments: 0,
          totalVisitors: 0,
          totalHosts: 0,
        },
        monthlyRegistrations: monthlyStats,
      },
    });
  }
);
