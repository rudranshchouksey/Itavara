import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@itvara/db';
import { OAuth2Client } from 'google-auth-library';
import { JwtPayload, LoginDTO, RegisterDTO } from '@itvara/types';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_for_dev';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export class AuthService {
  
  /**
   * Generates a short-lived Access Token
   */
  static generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  /**
   * Generates a long-lived Refresh Token
   */
  static generateRefreshToken(user: User): string {
    const payload = { userId: user.id };
    // Not strictly needed to be a JWT if it's just a random string stored in Redis, 
    // but a JWT provides self-contained info before querying Redis.
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  /**
   * Register a new user with email and password
   */
  static async register(data: RegisterDTO): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    if (!data.password) {
      throw new Error('Password is required for standard registration');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
    });

    return user;
  }

  /**
   * Login user with email and password
   */
  static async login(data: LoginDTO): Promise<User> {
    if (!data.password) {
      throw new Error('Password is required for standard login');
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  /**
   * Verify Google OAuth Token
   */
  static async verifyGoogleToken(idToken: string): Promise<User> {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      // Auto-register user from Google
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || 'Google User',
          profilePhoto: payload.picture,
          // Since password is required in the DB schema, we assign a dummy hash for oauth users
          passwordHash: await bcrypt.hash(Math.random().toString(36), 10),
        },
      });
    }

    return user;
  }

  /**
   * Verify JWT Token Signature
   */
  static verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}
