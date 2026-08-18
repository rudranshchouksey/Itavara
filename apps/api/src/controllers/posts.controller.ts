import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { RedisCacheService } from '../common/cache/redis-cache.service';

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

      // Validate embedded itinerary JSON blocks
      const itineraryRegex = /```json itinerary\n([\s\S]*?)\n```/g;
      let match;
      const extractedTags: { taggedListingId: string; inlinePosition: number }[] = [];
      let paragraphIndex = 0;
      
      const parts = content.split(/(```json itinerary\n[\s\S]*?\n```)/);
      for (const part of parts) {
        if (part.startsWith('```json itinerary')) {
          try {
            const jsonStr = part.replace(/```json itinerary\n/, '').replace(/\n```$/, '');
            const itineraryData = JSON.parse(jsonStr);
            if (!itineraryData.day || !itineraryData.description) {
              res.status(400).json({ error: 'Itinerary block missing required fields (day, description).' });
              return;
            }
            if (itineraryData.stay && itineraryData.stay.id) {
              extractedTags.push({
                taggedListingId: itineraryData.stay.id,
                inlinePosition: paragraphIndex
              });
            }
          } catch (e) {
            res.status(400).json({ error: 'Invalid JSON format in itinerary block.' });
            return;
          }
        } else {
          // Count paragraphs to keep track of inlinePosition
          const paragraphs = part.split('\n');
          paragraphIndex += paragraphs.length - 1;
        }
      }

      const post = await prisma.post.create({
        data: {
          userId,
          type: 'MINI_BLOG',
          title,
          content,
          mediaUrls: mediaUrls || [],
          tags: {
            create: extractedTags
          }
        }
      });

      // Invalidate trending feed cache
      RedisCacheService.delByPattern('cache:*/api/feed/trending*');

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
          },
          travelBuddyTags: {
            include: {
              taggedUser: {
                select: { id: true, name: true, profilePhoto: true }
              }
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

  static async addTagToPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: postId } = req.params;
      const { taggedListingId, taggedGuideId, timestamp, inlinePosition } = req.body;

      if (!taggedListingId && !taggedGuideId) {
        res.status(400).json({ error: 'Must provide either taggedListingId or taggedGuideId' });
        return;
      }

      // Verify the post belongs to the user
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true, type: true }
      });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.userId !== userId) {
        res.status(403).json({ error: 'Forbidden: You can only tag your own posts' });
        return;
      }

      // Ensure timestamp is only used for REEL, and inlinePosition for MINI_BLOG
      if (timestamp !== undefined && post.type !== 'REEL') {
        res.status(400).json({ error: 'Timestamps can only be used on REEL posts' });
        return;
      }
      
      if (inlinePosition !== undefined && post.type !== 'MINI_BLOG') {
        res.status(400).json({ error: 'Inline positions can only be used on MINI_BLOG posts' });
        return;
      }

      const tag = await prisma.tag.create({
        data: {
          postId,
          taggedListingId,
          taggedGuideId,
          timestamp,
          inlinePosition
        }
      });

      res.status(201).json({ data: tag });
    } catch (error: any) {
      console.error('Error adding tag to post:', error);
      res.status(500).json({ error: 'Internal server error adding tag' });
    }
  }

  static async addTravelBuddy(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: postId } = req.params;
      const { taggedUserId } = req.body;

      if (!taggedUserId) {
        res.status(400).json({ error: 'taggedUserId is required' });
        return;
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true }
      });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.userId !== userId) {
        res.status(403).json({ error: 'Forbidden: You can only tag buddies on your own posts' });
        return;
      }

      const buddyTag = await prisma.travelBuddyTag.create({
        data: {
          postId,
          taggedUserId,
          status: 'PENDING'
        }
      });

      res.status(201).json({ data: buddyTag });
    } catch (error: any) {
      console.error('Error adding travel buddy:', error);
      res.status(500).json({ error: 'Internal server error adding travel buddy' });
    }
  }

  static async updateTravelBuddyStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { tagId } = req.params;
      const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

      if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        res.status(400).json({ error: 'Invalid status. Must be ACCEPTED or REJECTED' });
        return;
      }

      const buddyTag = await prisma.travelBuddyTag.findUnique({
        where: { id: tagId }
      });

      if (!buddyTag) {
        res.status(404).json({ error: 'Travel buddy tag not found' });
        return;
      }

      if (buddyTag.taggedUserId !== userId) {
        res.status(403).json({ error: 'Forbidden: You can only update your own travel buddy tags' });
        return;
      }

      const updatedTag = await prisma.travelBuddyTag.update({
        where: { id: tagId },
        data: { status }
      });

      res.status(200).json({ data: updatedTag });
    } catch (error: any) {
      console.error('Error updating travel buddy status:', error);
      res.status(500).json({ error: 'Internal server error updating travel buddy status' });
    }
  }
}
