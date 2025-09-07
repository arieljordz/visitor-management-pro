// routes/user.routes.ts
import express from 'express';
import {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  changePassword,
  updateUser,
  deleteAccount,
  deleteUser,
  getUserStats,
  toggleUserStatus,
  createUser, // ⬅️ import createUser
} from '../controllers/user.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes (if any)
// router.get('/public-profile/:id', getUserById); // For public profiles

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Current user routes
router.get('/profile', getProfile);
router.patch('/profile', validateUpdateProfile, updateProfile);
router.patch('/change-password', validateChangePassword, changePassword);
router.delete('/account', deleteAccount);

// Admin only routes
router.use(restrictTo('admin')); // All routes below require admin role

router.post('/', createUser); // ⬅️ Create new user (Admin only)
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
