import { Router } from "express";
import authRoutes from "./auth.routes";
import collegeRoutes from "./college.routes";
import uploadRoutes from "./upload.routes";
import userRoutes from "./user.routes";
import discoverRoutes from "./discover.routes";
import swipeRoutes from "./swipe.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/colleges", collegeRoutes);
router.use("/upload", uploadRoutes);
router.use("/users", userRoutes);
router.use("/discover", discoverRoutes);
router.use("/swipes", swipeRoutes);

export default router;
