// src/awsConfig.js
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "ap-south-1", // replace with your bucket region
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
