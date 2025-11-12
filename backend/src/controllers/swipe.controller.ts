import { Response, NextFunction } from "express";
import { swipeService } from "../services/swipe.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const swipeController = {
  /**
   * POST /api/swipes
   * Create a swipe
   */
  async createSwipe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { swipedUserId, type } = req.body;

      if (!swipedUserId || !type) {
        return res.status(400).json({ 
          message: "swipedUserId and type are required" 
        });
      }

      if (!["LEFT", "RIGHT", "UP"].includes(type)) {
        return res.status(400).json({ 
          message: "type must be LEFT, RIGHT, or UP" 
        });
      }

      const result = await swipeService.createSwipe(userId, swipedUserId, type);

      res.json({
        success: true,
        matched: result.matched,
        match: result.match
      });
    } catch (error: any) {
      if (error.message === "Cannot swipe on yourself" || 
          error.message === "Already swiped on this user") {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },

  /**
   * GET /api/matches
   * Get all user's matches
   */
  async getMatches(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const matches = await swipeService.getMatches(userId);

      res.json({
        success: true,
        matches,
        count: matches.length
      });
    } catch (error) {
      next(error);
    }
  }
};
