import { type User } from '@prisma/client';
import { type Request } from 'express';

export interface JwtPayload {
    userId: string;
    email?: string;
    exp?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthRequest extends Request {
    user?: Omit<User, 'password'>;
}

export type SafeUser = Omit<User, 'password'>;
