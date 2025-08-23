import express from "express";
import { register, login, googleLogin, getMe, logout } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);

export default router;
