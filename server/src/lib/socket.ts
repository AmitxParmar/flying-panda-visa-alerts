import { Server as HttpServer } from 'http';
import { Server, type Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';

import logger from '@/lib/logger';

class SocketService {
    private io: Server | null = null;
    private static instance: SocketService;
    private pubClient: Redis | null = null;
    private subClient: Redis | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    /**
     * Gets the singleton instance of SocketService
     */
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    /**
     * Initializes Socket.io with the HTTP server
     * Optionally configures Redis adapter for horizontal scaling
     * @param httpServer - The HTTP server instance
     */
    public async initialize(httpServer: HttpServer): Promise<Server> {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:3000',
                credentials: true,
            },
            perMessageDeflate: false,
            httpCompression: false
        });

        // Setup Redis adapter for horizontal scaling (if REDIS_URL is configured)
        await this.setupRedisAdapter();



        // Connection handler


        logger.info('Socket.io initialized');
        return this.io;
    }

    /**
     * Setup Redis adapter for multi-server socket event broadcasting
     * This enables horizontal scaling - socket events are broadcast to all server instances
     * 
     * Supports:
     * - Standard Redis: REDIS_URL=redis://localhost:6379
     * - Upstash Redis (TLS): UPSTASH_REDIS_URL=rediss://...upstash.io:6379
     * 
     * For Upstash, use the "Redis URL (TCP - Native)" from your Upstash console,
     * NOT the REST API URL. It should start with "rediss://" (note the extra 's' for TLS)
     */
    private async setupRedisAdapter(): Promise<void> {
        // Support both standard Redis and Upstash
        const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

        if (!redisUrl) {
            logger.info('Redis URL not configured - Socket.io running in single-server mode');
            logger.info('To enable horizontal scaling, set REDIS_URL or UPSTASH_REDIS_URL (TCP endpoint)');
            return;
        }

        try {
            // Upstash TLS connections use rediss:// protocol
            // ioredis handles TLS automatically when URL starts with "rediss://"
            const redisOptions = {
                maxRetriesPerRequest: 3,
                retryDelayOnFailover: 100,
                // For Upstash, password is embedded in the URL
            };

            // Create pub/sub clients for the Redis adapter
            this.pubClient = new Redis(redisUrl, redisOptions);
            this.subClient = this.pubClient.duplicate();

            // Wait for both connections with timeout
            const connectionTimeout = 10000; // 10 seconds

            await Promise.race([
                Promise.all([
                    new Promise<void>((resolve, reject) => {
                        this.pubClient!.on('ready', () => resolve());
                        this.pubClient!.on('error', (err) => reject(err));
                    }),
                    new Promise<void>((resolve, reject) => {
                        this.subClient!.on('ready', () => resolve());
                        this.subClient!.on('error', (err) => reject(err));
                    }),
                ]),
                new Promise<void>((_, reject) =>
                    setTimeout(() => reject(new Error('Redis connection timeout')), connectionTimeout)
                ),
            ]);

            // Apply the Redis adapter
            this.io!.adapter(createAdapter(this.pubClient, this.subClient));

            const isUpstash = redisUrl.includes('upstash');
            logger.info(`Socket.io Redis adapter configured${isUpstash ? ' (Upstash)' : ''} - horizontal scaling enabled`);
        } catch (error) {
            logger.warn('Failed to setup Redis adapter, falling back to single-server mode:', error);
            // Clean up on failure
            this.pubClient?.disconnect();
            this.subClient?.disconnect();
            this.pubClient = null;
            this.subClient = null;
        }
    }

    /**
     * Gracefully shutdown Redis connections
     */
    public async shutdown(): Promise<void> {
        if (this.pubClient) {
            await this.pubClient.quit();
        }
        if (this.subClient) {
            await this.subClient.quit();
        }
        if (this.io) {
            this.io.close();
        }
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        logger.info('Socket.io shutdown complete');
    }

    /**
     * Parse cookie header string into key-value pairs
     */
    private parseCookies(cookieHeader: string): Record<string, string> {
        const cookies: Record<string, string> = {};
        if (!cookieHeader) return cookies;

        cookieHeader.split(';').forEach((cookie) => {
            const [name, ...rest] = cookie.split('=');
            if (name && rest.length > 0) {
                cookies[name.trim()] = rest.join('=').trim();
            }
        });
        return cookies;
    }

    /**
     * Gets the Socket.io server instance
     */
    public getIO(): Server | null {
        return this.io;
    }

}

export default SocketService.getInstance();
