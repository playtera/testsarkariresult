import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(buffer, filename, contentType) {
  try {
    if (!process.env.R2_BUCKET_NAME || !process.env.R2_ENDPOINT) {
        throw new Error("R2 not configured");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    // Construct the public URL (usually https://pub-xxxx.r2.dev/filename or custom domain)
    return `${process.env.R2_PUBLIC_URL}/${filename}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw error;
  }
}
