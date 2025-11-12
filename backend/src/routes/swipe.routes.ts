import { Router } from "express";
import { swipeController } from "../controllers/swipe.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All swipe routes require authentication
router.use(authMiddleware);

// POST /api/swipes - Create a swipe
router.post("/", swipeController.createSwipe);

// GET /api/matches - Get all matches
router.get("/matches", swipeController.getMatches);

export default router;
