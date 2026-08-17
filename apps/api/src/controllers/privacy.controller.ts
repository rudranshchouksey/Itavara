import { Request, Response } from 'express';
import { prisma, TaggingPermission } from '@itvara/db';

export const getPrivacySettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let settings = await prisma.userPrivacySetting.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await prisma.userPrivacySetting.create({
        data: { userId }
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updatePrivacySettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { isPrivateAccount, allowTaggingFrom, hiddenKeywords } = req.body;

    const dataToUpdate: any = {};
    if (isPrivateAccount !== undefined) dataToUpdate.isPrivateAccount = isPrivateAccount;
    if (allowTaggingFrom !== undefined && Object.values(TaggingPermission).includes(allowTaggingFrom)) {
      dataToUpdate.allowTaggingFrom = allowTaggingFrom;
    }
    if (hiddenKeywords !== undefined && Array.isArray(hiddenKeywords)) {
      dataToUpdate.hiddenKeywords = hiddenKeywords;
    }

    const settings = await prisma.userPrivacySetting.upsert({
      where: { userId },
      create: { userId, ...dataToUpdate },
      update: dataToUpdate
    });

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { targetUserId } = req.body;
    if (!userId || !targetUserId) return res.status(400).json({ error: 'Missing parameters' });

    const settings = await prisma.userPrivacySetting.upsert({
      where: { userId },
      create: { userId, blockedUserIds: [targetUserId] },
      update: {
        blockedUserIds: {
          push: targetUserId
        }
      }
    });
    // In a real app we'd want to ensure unique values using a Set or Prisma logic, but push works for demo.
    
    // Better: Ensure uniqueness
    const uniqueBlocks = Array.from(new Set(settings.blockedUserIds));
    if (uniqueBlocks.length !== settings.blockedUserIds.length) {
       await prisma.userPrivacySetting.update({
         where: { userId },
         data: { blockedUserIds: uniqueBlocks }
       });
    }

    res.status(200).json({ success: true, blockedUserIds: uniqueBlocks });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

export const muteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { targetUserId } = req.body;
    if (!userId || !targetUserId) return res.status(400).json({ error: 'Missing parameters' });

    const settings = await prisma.userPrivacySetting.upsert({
      where: { userId },
      create: { userId, mutedUserIds: [targetUserId] },
      update: {
        mutedUserIds: {
          push: targetUserId
        }
      }
    });

    const uniqueMutes = Array.from(new Set(settings.mutedUserIds));
    if (uniqueMutes.length !== settings.mutedUserIds.length) {
       await prisma.userPrivacySetting.update({
         where: { userId },
         data: { mutedUserIds: uniqueMutes }
       });
    }

    res.status(200).json({ success: true, mutedUserIds: uniqueMutes });
  } catch (error) {
    console.error('Error muting user:', error);
    res.status(500).json({ error: 'Failed to mute user' });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const targetUserId = req.params.id;
    if (!userId || !targetUserId) return res.status(400).json({ error: 'Missing parameters' });

    const settings = await prisma.userPrivacySetting.findUnique({ where: { userId } });
    if (!settings) return res.status(404).json({ error: 'Settings not found' });

    const newBlocked = settings.blockedUserIds.filter(id => id !== targetUserId);
    await prisma.userPrivacySetting.update({
      where: { userId },
      data: { blockedUserIds: newBlocked }
    });

    res.status(200).json({ success: true, blockedUserIds: newBlocked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

export const unmuteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const targetUserId = req.params.id;
    if (!userId || !targetUserId) return res.status(400).json({ error: 'Missing parameters' });

    const settings = await prisma.userPrivacySetting.findUnique({ where: { userId } });
    if (!settings) return res.status(404).json({ error: 'Settings not found' });

    const newMuted = settings.mutedUserIds.filter(id => id !== targetUserId);
    await prisma.userPrivacySetting.update({
      where: { userId },
      data: { mutedUserIds: newMuted }
    });

    res.status(200).json({ success: true, mutedUserIds: newMuted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unmute user' });
  }
};
