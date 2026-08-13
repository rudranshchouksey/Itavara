import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { PostType } from '@itvara/db'; // Make sure this is exported from prisma

export class FeedController {
  
  static async getReels(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const cursor = req.query.cursor as string;

      const posts = await prisma.post.findMany({
        where: {
          type: 'REEL',
        },
        take: limit + 1, // Fetch one extra to know if there's a next page
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // Skip the cursor itself
        }),
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
              verification: {
                select: {
                  badgeType: true,
                  isGovtIdVerified: true
                }
              }
            }
          },
          _count: {
            select: { likes: true, comments: true }
          },
          tags: {
            include: {
              taggedListing: {
                select: {
                  id: true,
                  title: true,
                  pricePerNight: true,
                  type: true
                }
              }
            }
          }
        }
      });

      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      res.status(200).json({
        data: posts,
        nextCursor,
      });
    } catch (error: any) {
      console.error('Error fetching reels feed:', error);
      res.status(500).json({ error: 'Internal server error fetching reels' });
    }
  }
}
