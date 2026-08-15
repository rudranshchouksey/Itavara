import { Request, Response } from 'express';
import { prisma } from '@itvara/db';

export class HostsController {
  static async createHighlight(req: Request, res: Response): Promise<void> {
    try {
      const hostId = (req.user as any)?.id || (req.user as any)?.userId;
      if (!hostId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Allow only HOST and SUPERHOST roles
      const user = await prisma.user.findUnique({ where: { id: hostId } });
      if (!user || (user.role !== 'HOST' && user.role !== 'SUPERHOST')) {
        res.status(403).json({ error: 'Forbidden. Only hosts can create highlights.' });
        return;
      }

      const { title, coverImageUrl, mediaUrls } = req.body;
      if (!title || !coverImageUrl || !mediaUrls || !Array.isArray(mediaUrls)) {
        res.status(400).json({ error: 'title, coverImageUrl, and mediaUrls array are required.' });
        return;
      }

      const highlight = await prisma.storyHighlight.create({
        data: {
          hostId,
          title,
          coverImageUrl,
          mediaUrls,
        },
      });

      res.status(201).json(highlight);
    } catch (error: any) {
      console.error('Error creating highlight:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getHostHighlights(req: Request, res: Response): Promise<void> {
    try {
      const { id: hostId } = req.params;

      const highlights = await prisma.storyHighlight.findMany({
        where: { hostId },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json(highlights);
    } catch (error: any) {
      console.error('Error fetching highlights:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteHighlight(req: Request, res: Response): Promise<void> {
    try {
      const hostId = (req.user as any)?.id || (req.user as any)?.userId;
      if (!hostId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: highlightId } = req.params;

      const highlight = await prisma.storyHighlight.findUnique({
        where: { id: highlightId },
      });

      if (!highlight) {
        res.status(404).json({ error: 'Highlight not found' });
        return;
      }

      if (highlight.hostId !== hostId) {
        res.status(403).json({ error: 'Forbidden. You do not own this highlight.' });
        return;
      }

      await prisma.storyHighlight.delete({
        where: { id: highlightId },
      });

      res.status(200).json({ message: 'Highlight deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting highlight:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
