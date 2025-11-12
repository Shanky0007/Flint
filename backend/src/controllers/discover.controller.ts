import { Response, NextFunction } from "express";
import { discoverService } from "../services/discover.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const discoverController = {
  /**
   * GET /api/discover/feed
   * Get users for discovery feed
   */
  async getDiscoverFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const limit = parseInt(req.query.limit as string) || 20;

      const users = await discoverService.getDiscoverFeed(userId, limit);

      res.json({
        success: true,
        users,
        count: users.length
      });
    } catch (error) {
      next(error);
    }
  }
};
