import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  addRefreshToken,
  revokeAllSessions,
  revokeRefreshToken,
  validateRefreshToken
} from '../services/redis.service';
import { LoginDTO, RegisterDTO } from '@itvara/types';

const IS_PROD = process.env.NODE_ENV === 'production';
const REFRESH_COOKIE_NAME = 'itvara_rt';

export class AuthController {
  
  /**
   * Helper to set the refresh token in an HTTP-only cookie
   */
  private static setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax', // Adjust based on cross-origin needs
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDTO = req.body;
      const user = await AuthService.register(data);

      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      await addRefreshToken(user.id, refreshToken);
      AuthController.setRefreshCookie(res, refreshToken);

      const { passwordHash, ...safeUser } = user;
      res.status(201).json({ accessToken, user: safeUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginDTO = req.body;
      const user = await AuthService.login(data);

      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      await addRefreshToken(user.id, refreshToken);
      AuthController.setRefreshCookie(res, refreshToken);

      const { passwordHash, ...safeUser } = user;
      res.status(200).json({ accessToken, user: safeUser });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
      if (!refreshToken) {
        res.status(401).json({ error: 'No refresh token provided' });
        return;
      }

      // We didn't decode the JWT from the token in redis.service, but we could.
      // Let's decode it to get the userId without verifying, or verify it if we have the secret.
      const jwt = require('jsonwebtoken');
      const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_for_dev';
      
      let payload;
      try {
        payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
        return;
      }

      const isValid = await validateRefreshToken(payload.userId, refreshToken);
      if (!isValid) {
        res.status(401).json({ error: 'Refresh token revoked' });
        return;
      }

      const { PrismaClient } = require('@itvara/db');
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Rotate token (optional, but good practice)
      await revokeRefreshToken(payload.userId, refreshToken);
      
      const newAccessToken = AuthService.generateAccessToken(user);
      const newRefreshToken = AuthService.generateRefreshToken(user);

      await addRefreshToken(user.id, newRefreshToken);
      AuthController.setRefreshCookie(res, newRefreshToken);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
      if (refreshToken) {
        const jwt = require('jsonwebtoken');
        const payload = jwt.decode(refreshToken) as { userId: string } | null;
        if (payload?.userId) {
          await revokeRefreshToken(payload.userId, refreshToken);
        }
      }

      res.clearCookie(REFRESH_COOKIE_NAME);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async googleOAuth(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) {
        res.status(400).json({ error: 'Google credential is required' });
        return;
      }

      const user = await AuthService.verifyGoogleToken(credential);

      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      await addRefreshToken(user.id, refreshToken);
      AuthController.setRefreshCookie(res, refreshToken);

      const { passwordHash, ...safeUser } = user;
      res.status(200).json({ accessToken, user: safeUser });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
