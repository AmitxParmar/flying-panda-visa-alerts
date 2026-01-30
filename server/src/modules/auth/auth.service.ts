import { type User } from '@prisma/client';
import authRepository from './auth.repository';
import jwtService from '@/lib/jwt';
import { redis } from '@/lib/redis';
import { HttpUnAuthorizedError, HttpBadRequestError, HttpNotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export default class AuthService {
  /**
   * Register a new user
   */
  public async register(data: RegisterInput): Promise<AuthResult> {
    logger.info(`User registration attempt: ${data.email}`);

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new HttpBadRequestError('User already exists', [
        'A user with this email already exists',
      ]);
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
      throw new HttpBadRequestError('Invalid password', [
        'Password must be at least 6 characters long',
      ]);
    }

    // Create user
    const user = await authRepository.createUser({
      email: data.email,
      name: data.name,
      password: data.password,
    });

    // Generate tokens
    const accessToken = jwtService.generateAccessToken({ userId: user.id });
    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    // Store Refresh Token in Redis (Key: auth:refresh_token:<token_uuid>)
    // Value: UserId
    // We use the token itself as key, or a hash of it. Since tokens are long, let's store it as is for simplicity in this demo.
    await redis.set(`auth:refresh_token:${refreshToken}`, user.id, { ex: REFRESH_TOKEN_TTL });

    // Update user online status - REMOVED per user request for simplicity
    // await authRepository.updateUser(user.id, {
    //   isOnline: true,
    // });

    logger.info(`User registered successfully: ${user.id}`);

    // Remove password from response
    const { password, ...safeUser } = user;
    return {
      user: safeUser,
      tokens: { accessToken, refreshToken },
    };
  }

  /**
   * Login user
   */
  public async login(data: LoginInput): Promise<AuthResult> {
    logger.info(`User login attempt: ${data.email}`);

    // Find user
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new HttpNotFoundError('User not found');
    }

    // Verify password
    const isPasswordValid = await authRepository.comparePassword(
      user,
      data.password
    );
    if (!isPasswordValid) {
      throw new HttpUnAuthorizedError('Invalid password');
    }

    // Generate tokens
    const accessToken = jwtService.generateAccessToken({ userId: user.id });
    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    // Store Refresh Token in Redis
    await redis.set(`auth:refresh_token:${refreshToken}`, user.id, { ex: REFRESH_TOKEN_TTL });

    // Update user status - REMOVED
    // await authRepository.updateUser(user.id, {
    //   isOnline: true,
    //   lastSeen: new Date(),
    // });

    logger.info(`User logged in successfully: ${user.id}`);

    // Remove password from response
    const { password, ...safeUser } = user;
    return {
      user: safeUser,
      tokens: { accessToken, refreshToken },
    };
  }

  /**
   * Logout user
   */
  public async logout(userId: string, refreshToken?: string): Promise<void> {
    logger.info(`User logout: ${userId}`);

    if (refreshToken) {
      await redis.del(`auth:refresh_token:${refreshToken}`);
    }

    // await authRepository.updateUser(userId, {
    //   isOnline: false,
    //   lastSeen: new Date(),
    // });
  }

  /**
   * Refresh tokens
   */
  public async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  }> {
    // 1. Verify token signature first (Stateless check)
    const result = jwtService.verifyRefreshTokenDetailed(refreshToken);

    if (!result.valid) {
      if (result.error === 'EXPIRED') {
        throw new HttpUnAuthorizedError(
          'Refresh token has expired',
          'REFRESH_TOKEN_EXPIRED'
        );
      }
      throw new HttpUnAuthorizedError('Invalid refresh token', 'REFRESH_TOKEN_INVALID');
    }

    // 2. Stateful Check in Redis
    const userId = await redis.get<string>(`auth:refresh_token:${refreshToken}`);

    if (!userId || userId !== result.payload.userId) {
      // Token not found in Redis (Revoked or Expired in Redis but valid signature)
      throw new HttpUnAuthorizedError('Invalid or revoked refresh token', 'REFRESH_TOKEN_REVOKED');
    }

    const payload = result.payload;

    // Find user
    const user = await authRepository.findUserById(payload.userId);
    if (!user) {
      throw new HttpUnAuthorizedError('User not found', 'USER_NOT_FOUND');
    }

    // Match checks out. Rotate tokens.

    // Delete old token
    await redis.del(`auth:refresh_token:${refreshToken}`);

    // Generate new tokens
    const newAccessToken = jwtService.generateAccessToken({ userId: user.id });
    const newRefreshToken = jwtService.generateRefreshToken({ userId: user.id });

    // Store new token
    await redis.set(`auth:refresh_token:${newRefreshToken}`, user.id, { ex: REFRESH_TOKEN_TTL });

    // No longer updating DB for refreshToken
    // await authRepository.updateUser...

    logger.info(`Tokens refreshed successfully: ${user.id}`);

    // Remove password from response
    const { password, ...safeUser } = user;
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: safeUser,
    };
  }

  /**
   * Get current user
   */
  public async getCurrentUser(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await authRepository.findUserById(userId);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Update profile
   */
  public async updateProfile(
    userId: string,
    data: {
      name?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await authRepository.updateUser(userId, data);

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  /**
   * Change password
   */
  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      throw new HttpBadRequestError('Invalid password', [
        'New password must be at least 6 characters long',
      ]);
    }

    // Get user and verify current password
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new HttpNotFoundError('User not found');
    }

    const isPasswordValid = await authRepository.comparePassword(user, currentPassword);
    if (!isPasswordValid) {
      throw new HttpUnAuthorizedError('Current password is incorrect');
    }

    // Update password
    await authRepository.updatePassword(userId, newPassword);

    logger.info(`Password changed successfully: ${userId}`);
  }
}
