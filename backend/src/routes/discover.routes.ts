import { Router } from "express";
import { discoverController } from "../controllers/discover.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All discover routes require authentication
router.use(authMiddleware);

// GET /api/discover/feed - Get users for discovery
router.get("/feed", discoverController.getDiscoverFeed);

export default router;
