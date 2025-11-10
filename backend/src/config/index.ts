import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  databaseUrl: process.env.DATABASE_URL,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_S3_REGION || "ap-south-1",
    bucket: process.env.AWS_S3_BUCKET || "",
  },
};
