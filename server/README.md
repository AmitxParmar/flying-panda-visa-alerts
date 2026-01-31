# Visa Alerts - Server

The backend API for the Visa Alerts tool, built with Express.js and Prisma.

## 🏗 Architecture & Design

### Modular Structure
The codebase follows a scalable module-based pattern. Each feature (e.g., `auth`, `alert`) is self-contained:

```text
src/
├── modules/
│   ├── alert/
│   │   ├── alert.controller.ts  # Request handling
│   │   ├── alert.service.ts     # Business logic
│   │   ├── alert.repository.ts  # Database queries
│   │   └── alert.route.ts       # Route definitions
│   └── auth/
└── middlewares/                 # Shared middlewares
```

### Key Components

1.  **Prisma ORM:**
    - Type-safe database access.
    - Schema defined in `prisma/schema.prisma`.
    - Integrated with MongoDB (mapped IDs) for flexibility.

2.  **Authentication & Security:**
    - **JWT:** Stateless authentication with Access (15m) and Refresh (7d) tokens.
    - **HttpOnly Cookies:** Tokens are stored in secure cookies, not LocalStorage, mitigating XSS risks.
    - **Rate Limiting:** `express-rate-limit` protects against brute-force attacks.

3.  **Validation:**
    - **Zod:** Runtime request validation via middleware. ensuring bad data never reaches the controller.

4.  **Error Handling:**
    - Centralized `errorHandler` middleware catches sync and async errors.
    - Standardized error response format (`code`, `message`, `success: false`).

## 🛠 Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm run prisma:generate

# Seed Database (200 Dummy Alerts)
pnpm run seed

# Run Server
pnpm run dev
```

## 📚 API Documentation

(Optional: If Swagger is enabled)
Visit `http://localhost:8000/v1/swagger` for interactive API docs.
