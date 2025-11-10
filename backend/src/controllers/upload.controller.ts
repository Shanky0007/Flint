import { Request, Response } from "express";
import { s3Service } from "../utils/s3.service";

export const uploadController = {
  async uploadPhotos(req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Validate file types
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const invalidFiles = req.files.filter(
        (file) => !allowedTypes.includes(file.mimetype)
      );

      if (invalidFiles.length > 0) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, and WebP are allowed",
        });
      }

      // Validate file sizes (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = req.files.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        return res.status(400).json({
          message: "File size too large. Maximum size is 5MB per file",
        });
      }

      // Upload to S3
      const urls = await s3Service.uploadMultipleFiles(req.files);

      res.status(200).json({
        message: "Files uploaded successfully",
        urls,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload files" });
    }
  },
};
