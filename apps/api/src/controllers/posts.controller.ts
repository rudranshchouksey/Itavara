import { Request, Response } from 'express';
import { prisma } from '@itvara/db';

export class PostsController {
  
  static async createMiniBlog(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, content, mediaUrls } = req.body;

      if (!content) {
        res.status(400).json({ error: 'Content is required.' });
        return;
      }

      // Word count validation (approximate by splitting on whitespace)
      const wordCount = content.trim().split(/\s+/).length;
      if (wordCount > 2500) {
        res.status(400).json({ error: `Mini-blog cannot exceed 2,500 words. Current count: ${wordCount}` });
        return;
      }

      const post = await prisma.post.create({
        data: {
          userId,
          type: 'MINI_BLOG',
          title,
          content,
          mediaUrls: mediaUrls || [],
        }
      });

      res.status(201).json({ data: post, wordCount });
    } catch (error: any) {
      console.error('Error creating mini-blog:', error);
      res.status(500).json({ error: 'Internal server error creating mini-blog' });
    }
  }

  static async getMiniBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
              bio: true,
            }
          },
          _count: {
            select: { likes: true, comments: true }
          },
          tags: {
            include: {
              taggedListing: true,
            }
          }
        }
      });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.type !== 'MINI_BLOG') {
        res.status(400).json({ error: 'Requested post is not a mini-blog' });
        return;
      }

      res.status(200).json({ data: post });
    } catch (error: any) {
      console.error('Error fetching mini-blog:', error);
      res.status(500).json({ error: 'Internal server error fetching mini-blog' });
    }
  }
}
