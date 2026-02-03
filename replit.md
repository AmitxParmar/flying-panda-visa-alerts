# Visa Alerts Application

## Overview
This is a fullstack Visa Alerts application with a Next.js frontend and an Express/TypeScript backend with Prisma ORM.

## Project Structure
- `client/` - Next.js 16 frontend application (port 5000)
- `server/` - Express.js backend with Prisma ORM (port 3001)

## Architecture

### Frontend (client/)
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives

### Backend (server/)
- **Framework**: Express 5 with TypeScript
- **ORM**: Prisma with MongoDB
- **Authentication**: JWT (access + refresh tokens)
- **Caching**: Upstash Redis
- **Real-time**: Socket.IO

## Environment Variables Required

### Server Environment Variables
- `DATABASE_URL` - MongoDB connection string (required)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL (required)
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token (required)
- `APP_BASE_URL` - Backend URL (default: http://localhost:3001)
- `PORT` - Backend port (default: 3001)
- `CLIENT_URL` - Frontend URL (default: http://localhost:5000)
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `JWT_ACCESS_EXPIRY` - Access token expiry (default: 1h)
- `JWT_REFRESH_EXPIRY` - Refresh token expiry (default: 7d)

### Client Environment Variables
- `NEXT_PUBLIC_BASE_API_URL` - Backend API URL (default: http://localhost:3001)

## Running the Application

### Frontend Only
```bash
cd client && pnpm dev
```

### Backend (requires MongoDB and Redis)
```bash
cd server && pnpm dev
```

## Recent Changes
- 2026-02-03: Configured for Replit environment
  - Frontend now runs on port 5000 with 0.0.0.0 host
  - Backend configured for port 3001
  - Added allowedDevOrigins for Replit proxy support

## User Preferences
- Package manager: pnpm
