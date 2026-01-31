# Visa Alerts - Client

The frontend application for the Visa Alerts tool, built with Next.js 15.

## ⚡ Key Features & Optimizations

### 1. Architecture
- **App Router:** Utilizes Next.js 15 App Router for improved performance and server components where applicable.
- **Service Layer:** API calls are abstracted into `services/` and `hooks/` to separate data fetching from UI components.
- **Context API:** `AuthContext` manages global user state with persistence handling.

### 2. Performance
- **React Query:** 
  - Handles server state caching, deduping requests.
  - Implements **Infinite Scrolling** for the dashboard to handle large dataset efficiently without heavy initial loads.
- **Debounced Inputs:** Search inputs are debounced to prevent API flooding.

### 3. UX / UI
- **Shadcn/UI:** Accessible, professional components based on Radix UI.
- **Responsive Design:** Fully mobile-responsive layouts (sidebar collapses to sheet, tables adapt to cards).
- **Inter Font:** Integrated standard Inter font for clean typography.
- **Real-time Feedback:** Toast notifications (Sonner) for all async actions.

## 🛠 Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

## 📁 Structure

- `app/`: Next.js pages and layouts (Routes).
- `components/ui/`: Reusable primitive components (Button, Input).
- `components/common/`: Shared layout components (Header, Sidebar).
- `hooks/`: Custom React hooks (useAuth, useAlert).
- `services/`: Axios API wrappers.
- `schemas/`: Zod validation schemas shared with forms.
- `lib/`: Utilities (API interceptors, currency formatters).
