import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import visitorRoutes from "./visitor.routes";
import appointmentRoutes from "./appointment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/visitors", visitorRoutes);
router.use("/appointments", appointmentRoutes);

export default router;
