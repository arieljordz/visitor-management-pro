// routes/appointment.routes.ts
import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  createAppointment, // ⬅️ import createAppointment
} from '../controllers/appointment.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Admin only routes
router.use(restrictTo('admin')); // All routes below require admin role

router.post('/', createAppointment); // ⬅️ Create new appointment (Admin only)
router.get('/', getAllAppointments);
router.get('/stats', getAppointmentStats);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
