import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// These should be configured in .env
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'itvara-uploads-dev';

// Ensure you have AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in env
const s3Client = new S3Client({ region: REGION });

export class UploadController {
  
  static async getAvatarUploadUrl(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { fileType } = req.body; // e.g., 'image/jpeg' or 'image/png'
      if (!fileType || !fileType.startsWith('image/')) {
        res.status(400).json({ error: 'Invalid file type. Must be an image.' });
        return;
      }

      // Generate a unique filename
      const extension = fileType.split('/')[1];
      const filename = `avatars/${userId}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        ContentType: fileType,
      });

      // Url expires in 5 minutes
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${filename}`;

      res.status(200).json({ uploadUrl, fileUrl });
    } catch (error: any) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).json({ error: 'Internal server error generating upload URL' });
    }
  }
}
