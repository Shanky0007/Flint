import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch("/profile-setup", authMiddleware, authController.updateProfileSetup);
router.patch("/preferences", authMiddleware, authController.updatePreferences);

export default router;
