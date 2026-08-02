import { Request, Response } from 'express';
import { minioClient, BUCKET_NAME } from '../../../lib/storage';
import crypto from 'crypto';

export async function uploadImageHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Role check: Only admin is allowed to upload catalog images
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;

    // Upload buffer to MinIO bucket
    await minioClient.putObject(
      BUCKET_NAME,
      uniqueFilename,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    // Construct public access URL
    const publicHost = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    const fileUrl = `${publicHost}/${BUCKET_NAME}/${uniqueFilename}`;

    return res.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      error: 'Internal server error during upload',
      details: error.message || String(error),
    });
  }
}
