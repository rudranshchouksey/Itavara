import { Request, Response } from 'express';
import { VerificationService } from '../services/verification.service';
import { VerificationRequestDTO } from '@itvara/types';

export class VerificationController {
  
  static async requestVerification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data: VerificationRequestDTO = req.body;
      const updatedBadge = await VerificationService.processVerification(userId, data);
      
      res.status(200).json(updatedBadge);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const badge = await VerificationService.getVerificationStatus(userId);
      res.status(200).json(badge);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
