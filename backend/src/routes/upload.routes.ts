import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 6, // Max 6 files at once
  },
});

// Upload photos endpoint (protected)
router.post(
  "/photos",
  authMiddleware,
  upload.array("photos", 6),
  uploadController.uploadPhotos
);

export default router;
