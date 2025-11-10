import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "../config";
import crypto from "crypto";
import path from "path";

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const s3Service = {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const key = `user-photos/${fileName}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // Return public URL
    const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
    return url;
  },

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  },
};
