import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// These should be configured in .env
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'itvara-uploads-dev';

// Ensure you have AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in env
const s3Client = new S3Client({ region: REGION });

export class MediaController {
  
  static async getUploadUrl(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { fileType, isVideo } = req.body; 
      if (!fileType) {
        res.status(400).json({ error: 'fileType is required.' });
        return;
      }

      // Allow images and videos
      if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        res.status(400).json({ error: 'Invalid file type. Must be an image or video.' });
        return;
      }

      const extension = fileType.split('/')[1];
      const folder = isVideo || fileType.startsWith('video/') ? 'videos' : 'images';
      const fileKey = `${folder}/${userId}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType,
      });

      // Url expires in 15 minutes (useful for larger video files)
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

      const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`;

      res.status(200).json({ uploadUrl, fileUrl, fileKey });
    } catch (error: any) {
      console.error('Error generating pre-signed media URL:', error);
      res.status(500).json({ error: 'Internal server error generating upload URL' });
    }
  }

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      // Assuming a generic webhook payload from a transcoding service
      const payload = req.body;
      
      console.log('Received Media Webhook:', JSON.stringify(payload));
      
      // In a real scenario, you'd verify the signature of the webhook here
      const { status, mediaId, outputs } = payload;
      
      if (status === 'COMPLETED' && mediaId) {
        // You would typically use Prisma here to update a Listing, Post, or Media record.
        // Example:
        // await prisma.post.update({ ... })
        console.log(`Successfully processed media webhook for ${mediaId}`);
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Error handling media webhook:', error);
      res.status(500).json({ error: 'Internal server error handling webhook' });
    }
  }
}
