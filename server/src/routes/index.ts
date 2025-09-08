import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import visitorRoutes from "./visitor.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/visitors", visitorRoutes);

export default router;
