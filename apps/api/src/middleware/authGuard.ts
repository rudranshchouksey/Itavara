import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { getActiveRole } from '../services/redis.service';
import { JwtPayload } from '@itvara/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function authGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const payload = AuthService.verifyJwt(token);
    
    // Check if there is an active role override in Redis
    const activeRole = await getActiveRole(payload.userId);
    if (activeRole) {
      payload.role = activeRole;
    }
    
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
}

