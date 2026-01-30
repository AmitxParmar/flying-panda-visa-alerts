import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Repository for auth operations with WhatsApp ID-based authentication
 */
export class AuthRepository {
    /**
     * Find user by Email
     */
    public async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Find user by ID
     */
    public async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Create user with Email
     */
    public async createUser(data: {
        email: string;
        name: string;
        password: string;
        profilePicture?: string;
    }): Promise<User> {
        const passwordHash = await bcrypt.hash(data.password, 12);

        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: passwordHash,
            },
        });
    }

    /**
     * Update user
     */
    /**
     * Update user (name only as others are removed)
     */
    public async updateUser(
        id: string,
        data: {
            name?: string;
        }
    ): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    /**
     * Update password
     */
    public async updatePassword(id: string, newPassword: string): Promise<void> {
        const passwordHash = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id },
            data: { password: passwordHash },
        });
    }

    /**
     * Compare password
     */
    public async comparePassword(
        user: User,
        candidatePassword: string
    ): Promise<boolean> {
        return bcrypt.compare(candidatePassword, user.password);
    }
}

export default new AuthRepository();
