// routes/visitor.routes.ts
import express from 'express';
import {
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  getVisitorStats,
  createVisitor, // ⬅️ import createVisitor
} from '../controllers/visitor.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Admin only routes
router.use(restrictTo('admin')); // All routes below require admin role

router.post('/', createVisitor); // ⬅️ Create new visitor (Admin only)
router.get('/', getAllVisitors);
router.get('/stats', getVisitorStats);
router.get('/:id', getVisitorById);
router.put('/:id', updateVisitor);
router.delete('/:id', deleteVisitor);

export default router;
