import { Router } from "express";
import authRoutes from "./auth.routes";
import collegeRoutes from "./college.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/colleges", collegeRoutes);
router.use("/upload", uploadRoutes);

export default router;
