// routes/auth.routes.ts
import express from "express";
import { protect } from "../middleware/auth.middleware";
import { 
  login, 
  register, 
  getMe, 
  refreshToken, 
  logout 
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

router.post("/logout", logout);

router.get("/me", protect, getMe);

export default router;