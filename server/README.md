# Quick Chat - Backend API


## 🚀 Features


---

## 📋 Table of Contents



---

## 🛠 Tech Stack


---

## ✅ Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm
- MongoDB instance (local or cloud)

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quick-chat/server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma client**
   ```bash
   pnpm run prisma:generate
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
APP_BASE_URL=http://localhost

# Database
DATABASE_URL="mongodb://localhost:27017/quick-chat?authSource=admin"

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# JWT Secrets (Generate strong random strings)
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

---

## 🏃 Running the Application

### Development Mode
```bash
pnpm run dev
```
Server starts at `http://localhost:8000`

### Production Build
```bash
pnpm run build
pnpm start
```

---

## 🐳 Docker Deployment

The application includes a production-ready `Dockerfile`.

### Build & Run locally
```bash
# Build image
docker build -t quick-chat-server .

# Run container
docker run -p 8000:8000 --env-file .env quick-chat-server
```

### Deploy on Render (Docker Runtime)
1. Create a **New Web Service**.
2. Connect your repo.
3. Select **Docker** as the Runtime.
4. Set **Root Directory** to `server`.
5. Add your Environment Variables.
6. Deploy!

---

## 🏗 Architecture

### Project Structure (Module-based)

```

```

---

## � API Endpoints

### Authentication


### Messages

### Conversations


For full documentation, run the server and visit:
`http://localhost:8000/v1/swagger`
