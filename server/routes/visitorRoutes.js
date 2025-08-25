import express from "express";
import {
  getVisitors,
  searchVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitorById,
} from "../controllers/visitorController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all visitors
router.get("/", authenticate, getVisitors);

// Get visitor by ID
router.get("/:id", authenticate, getVisitorById);

// Search visitors by query (name, email, phone, etc.)
router.get("/search/query", authenticate, searchVisitors);

// Create a new visitor
router.post("/", authenticate, addVisitor);

// Update a visitor
router.put("/:id", authenticate, updateVisitor);

// Delete a visitor
router.delete("/:id", authenticate, deleteVisitor);

export default router;
