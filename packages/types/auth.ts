import { User } from '@itvara/db';

export interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
}

export interface LoginDTO {
  email: string;
  password?: string;
  credential?: string; // For Google OAuth
}

export interface RegisterDTO {
  email: string;
  password?: string;
  name: string;
  credential?: string; // For Google OAuth
}
