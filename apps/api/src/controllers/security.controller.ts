import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { getActiveSessions, revokeRefreshToken } from '../services/redis.service';

export const setup2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `Itvara (${user.email})`
    });

    // Save temporary secret to DB (not enabled yet)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 }
    });

    // Generate QR Code data URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    res.status(200).json({
      secret: secret.base32,
      qrCodeUrl
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA setup not initiated' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      // Generate some random backup codes
      const backupCodes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          backupCodes
        }
      });

      res.status(200).json({ success: true, backupCodes });
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sessions = await getActiveSessions(userId);
    
    // We filter out raw token strings and parse them to presentable format
    const safeSessions = sessions.map(s => {
      // If it's a legacy plain string token
      if (s.legacy) {
        return {
          id: s.token.substring(0, 8), // just a mock ID
          device: 'Unknown Device',
          location: 'Unknown Location',
          lastActive: s.createdAt
        };
      }
      
      return {
        id: s.token.substring(0, 8),
        device: s.userAgent || 'Unknown Device',
        ip: s.ip || 'Unknown IP',
        lastActive: s.createdAt,
        token: s.token // needed for deletion
      };
    });

    res.status(200).json({ sessions: safeSessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
};

export const terminateSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.params; // we passed token substring as ID, so we need the full token or pass token directly.
    const { token } = req.body; // better to accept token to delete

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!token) return res.status(400).json({ error: 'Token to terminate is required' });

    await revokeRefreshToken(userId, token);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error terminating session:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
};
