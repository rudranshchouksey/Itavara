import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { setActiveRole } from '../services/redis.service';
export class UserController {
  
  static async switchRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { role } = req.body;
      const validRoles = ['GUEST', 'HOST', 'SUPERHOST', 'TRAVEL_ADMIN'];

      if (!validRoles.includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      // Update in DB
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      // Update in Redis Session
      await setActiveRole(userId, role);

      res.status(200).json({ message: `Successfully switched role to ${role}`, role });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { bio, hometown, profilePhoto, name } = req.body;

      const dataToUpdate: any = {};
      if (bio !== undefined) dataToUpdate.bio = bio;
      if (hometown !== undefined) dataToUpdate.hometown = hometown;
      if (profilePhoto !== undefined) dataToUpdate.profilePhoto = profilePhoto;
      if (name !== undefined) dataToUpdate.name = name;

      const user = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      const { passwordHash, ...safeUser } = user;
      res.status(200).json(safeUser);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error updating profile' });
    }
  }

  static async getProfilePosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { userId },
            {
              travelBuddyTags: {
                some: {
                  taggedUserId: userId,
                  status: 'ACCEPTED'
                }
              }
            }
          ]
        },
        include: {
          user: {
            select: { id: true, name: true, profilePhoto: true }
          },
          travelBuddyTags: {
            include: {
              taggedUser: {
                select: { id: true, name: true, profilePhoto: true }
              }
            }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({ data: posts });
    } catch (error: any) {
      console.error('Error fetching profile posts:', error);
      res.status(500).json({ error: 'Internal server error fetching profile posts' });
    }
  }
}

