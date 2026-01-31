# Visa Alerts - The Flying Panda Intern Assignment

A full-stack tracking tool for visa slot alerts, built as an internal tool assignment for The Flying Panda.

![Assignment Details](/uploaded_media_1769839860192.jpg)

## 📋 Table of Contents
- [Assignment Overview](#-assignment-overview)
- [Tech Stack](#-tech-stack)
- [Architecture & Design](#-architecture--design)
- [Installation & Setup](#-installation--setup)
- [Improvements for Production](#-improvements-for-production)
- [AI Usage Disclosure](#-ai-usage-disclosure)

---

## 📝 Assignment Overview

**Scenario:** Build a mini internal tool to track visa slot alerts.

**Data Model:**
- `id`: UUID
- `country`: String
- `city`: String
- `visaType`: Enum (Tourist/Business/Student)
- `status`: Enum (Active/Booked/Expired)
- `createdAt`: DateTime

**Backend Requirements:**
- Node.js + Express
- CRUD Routes for `/alerts`
- Custom middleware (logger/validator)
- Query filters & centralized error handling
- Database storage (Used Prisma + SQLite/Postgres)

**Frontend Requirements:**
- React (Next.js)
- UI to create, view, update, and delete alerts
- Connects to own API

---

## 🛠 Tech Stack

### Client (`/client`)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Shadcn/UI
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

### Server (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Prisma ORM (SQLite for dev / Postgres ready) (Currently configured for MongoDB in `schema.prisma` mapping but logic assumes relational, need to verify. *Correction: Using MongoDB as per schema map("users") / map("_id") seen in logs*)
- **Validation:** Zod
- **Auth:** JWT (Access + Refresh Tokens) + Cookies
- **Documentation:** Swagger/OpenAPI

---

## 🏗 Architecture & Design

### **1. Monorepo-style Structure**
Separated `client` and `server` directories for clear separation of concerns while keeping the project unified.

### **2. Feature-based Modules (Server)**
The backend is organized by feature modules (`auth`, `alert`) rather than technical layers. Each module contains its own:
- `route.ts`: API definitions
- `controller.ts`: Request handling
- `service.ts`: Business logic
- `repository.ts`: Database access
- `dto.ts`: Data Transfer Objects (Validation)

### **3. Authentication**
Implemented a robust secure authentication system using **HttpOnly Cookies** to prevent XSS attacks. Includes:
- Auto-refreshing tokens via Axios interceptors.
- Middleware for role/user verification.
- Rate limiting on sensitive endpoints.

### **4. Frontend Optimizations**
- **Infinite Scroll:** Implemented using Intersection Observer + React Query `useInfiniteQuery` for the dashboard list.
- **Optimistic Updates:** Immediate UI feedback for Create/Update/Delete actions.
- **Centralized API Client:** Axios instance with automated error handling and token refresh logic.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 18
- pnpm (recommended) or npm
- MongoDB (running locally or URI)

### 1. Server Setup
```bash
cd server
cp .env.example .env 
# Update .env with your MongoDB URI
pnpm install
pnpm run prisma:generate
pnpm run seed # Optional: Seeds 200 dummy alerts
pnpm run dev
```

### 2. Client Setup
```bash
cd client
cp .env.example .env
pnpm install
pnpm run dev
```
Visit http://localhost:3000

---

## 🚀 Improvements for Production

1.  **Strict Rate Limiting:** Implement Redis-based rate limiting for specific user actions (e.g., 100 alerts/hour).
2.  **WebSockets:** Real-time updates for alert status changes (e.g., if one admin marks "Booked", others see it instantly).
3.  **Comprehensive Testing:** Add Unit tests (Jest) for Services and E2E tests (Playwright) for critical flows.
4.  **Audit Logs:** Track *who* modified a specific alert and when.
5.  **Role Based Access Control (RBAC):** Separate "Viewer" vs "Admin" roles.

---

## 🤖 AI Usage Disclosure

Transparency on how AI tools (Gemini/Antigravity) were utilized in this assignment:

| Area | Helper vs Human | Details |
| :--- | :--- | :--- |
| **Project Structure** | **Human Guided** | I defined the monorepo structure and modular backend architecture (separation of concerns: controller, service, repo) to ensure scalability. Directed AI to implement this specific pattern. |
| **Clean Code & Patterns** | **Human Guided** | Enforced specific coding standards: use of DTOs for validation, centralized error handling, and separation of UI components from logic (custom hooks). AI generated the boilerplate based on these strict constraints. |
| **Authentication Logic** | **Collaborative** | AI scaffolded the initial JWT flow; I gained deep understanding of the `auth/me` recursive fetch issue and guided the specific fix (wrapping response object) which AI initially missed. |
| **Database Schema** | **Human** | Designed the `VisaAlert` schema and relationships based on requirements. |
| **UI Components** | **AI** | Generated Shadcn/UI components (Cards, Forms, Sidebar) to ensure professional aesthetics quickly, while I customized the layout and responsiveness. |
| **Business Logic** | **Human** | Implemented the specific CRUD rules, filters, and state management logic. |

---
**Submission by:** Amit Parmar
