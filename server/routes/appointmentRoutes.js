import express from "express";
import {
  getAppointments,
  searchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  approveAppointment,
  declineAppointment,
} from "../controllers/appointmentController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Get all appointments
router.get("/", authenticate, getAppointments);

// Search appointments by query
router.get("/search", authenticate, searchAppointments);

// Create a new appointment
router.post("/", authenticate, addAppointment);

// Update an appointment
router.put("/:id", authenticate, updateAppointment);

// Delete an appointment
router.delete("/:id", authenticate, deleteAppointment);

// Approve an appointment
router.put("/:id/approve", authenticate, approveAppointment);

// Decline an appointment
router.put("/:id/decline", authenticate, declineAppointment);

export default router;
