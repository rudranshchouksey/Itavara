import { Request, Response } from 'express';
import { prisma } from '@itvara/db';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;

    // We use cursor-based pagination. If cursor is provided, we fetch after that cursor.
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      take: limit + 1, // take one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // skip the cursor itself
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, profilePhoto: true }
        }
      }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (notifications.length > limit) {
      const nextItem = notifications.pop(); // remove the extra item
      nextCursor = nextItem!.id;
    }

    res.status(200).json({ notifications, nextCursor });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      pauseAllUntil,
      likesComments,
      followersTags,
      messagesCalls,
      marketingPromotions,
      securityAlerts
    } = req.body;

    const updatedPrefs = await prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        pauseAllUntil: pauseAllUntil ? new Date(pauseAllUntil) : null,
        likesComments: likesComments ?? true,
        followersTags: followersTags ?? true,
        messagesCalls: messagesCalls ?? true,
        marketingPromotions: marketingPromotions ?? true,
        securityAlerts: securityAlerts ?? true,
      },
      update: {
        pauseAllUntil: pauseAllUntil !== undefined ? (pauseAllUntil ? new Date(pauseAllUntil) : null) : undefined,
        likesComments,
        followersTags,
        messagesCalls,
        marketingPromotions,
        securityAlerts,
      }
    });

    res.status(200).json(updatedPrefs);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true }
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};
