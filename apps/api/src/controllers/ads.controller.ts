import { Request, Response } from 'express';
import { prisma, CampaignType, CampaignStatus, InteractionType } from '@itvara/db';
import redis from '../services/redis.service';

export const getFeedAds = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;
    
    // In a real high-scale system, we'd pull active campaigns from Redis.
    // For now, we query DB for active SOCIAL_FEED_AD and BANNER campaigns.
    const campaigns = await prisma.sponsoredCampaign.findMany({
      where: {
        status: 'ACTIVE',
        campaignType: { in: ['SOCIAL_FEED_AD', 'BANNER'] },
        budget: { gt: prisma.sponsoredCampaign.fields.spent }
      },
      take: Number(limit),
      include: {
        listing: {
          include: {
            customOptions: true,
          }
        },
        advertiser: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
            verification: true
          }
        }
      },
      orderBy: {
        cpcRate: 'desc' // Basic auction logic: highest CPC wins
      }
    });

    res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Error fetching feed ads:', error);
    res.status(500).json({ error: 'Failed to fetch feed ads' });
  }
};

export const trackInteraction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { campaignId, interactionType } = req.body;

    if (!campaignId || !interactionType) {
      return res.status(400).json({ error: 'Missing campaignId or interactionType' });
    }

    if (interactionType !== 'IMPRESSION' && interactionType !== 'CLICK') {
      return res.status(400).json({ error: 'Invalid interactionType' });
    }

    // High performance tracking using Redis
    // We increment a counter in Redis, then a background job would sync to DB.
    // We also record the interaction in DB for persistence.
    
    const redisKey = `ad:${campaignId}:${interactionType.toLowerCase()}s`;
    await redis.incr(redisKey);

    // If it's a click, we deduct budget via Redis to ensure we don't overspend quickly.
    // We will do a DB operation here for simplicity, but ideally, this is batched.
    const campaign = await prisma.sponsoredCampaign.findUnique({
      where: { id: campaignId },
      select: { cpcRate: true, budget: true, spent: true, id: true, status: true }
    });

    if (campaign && campaign.status === 'ACTIVE') {
      await prisma.$transaction([
        prisma.adInteraction.create({
          data: {
            campaignId,
            userId: userId || null,
            interactionType: interactionType as InteractionType,
          }
        }),
        prisma.sponsoredCampaign.update({
          where: { id: campaignId },
          data: {
            impressions: interactionType === 'IMPRESSION' ? { increment: 1 } : undefined,
            clicks: interactionType === 'CLICK' ? { increment: 1 } : undefined,
            spent: interactionType === 'CLICK' ? { increment: campaign.cpcRate } : undefined,
            status: (interactionType === 'CLICK' && Number(campaign.spent) + Number(campaign.cpcRate) >= Number(campaign.budget)) ? 'DEPLETED' : undefined
          }
        })
      ]);
    } else if (campaign && campaign.status !== 'ACTIVE') {
      // Just record interaction if paused/depleted but somehow still shown
      await prisma.adInteraction.create({
        data: {
          campaignId,
          userId: userId || null,
          interactionType: interactionType as InteractionType,
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking ad interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
};
