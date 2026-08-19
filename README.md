# Itvara

**Itvara** is a next-generation platform blending a hybrid accommodation marketplace with a content-to-commerce social discovery engine. Discover unique stays, share your experiences through immersive mini-blogs and video reels, and instantly book curated guides and accommodations directly from the feed.

## 🌟 Core Features

- **Unique Accommodations:** Explore and book a diverse range of stays including Monasteries, Ashrams, Hostels, Tents, Work Studios, and Mansions.
- **Social Commerce Engine:**
  - **Mini-Blogs:** Write up to 2,500-word engaging travel stories.
  - **Video Reels:** Share immersive, short-form video content.
  - **Content-to-Commerce Tagging:** Directly tag Stay IDs and Guide IDs in your content. Viewers can click a tagged `BookablePill` to instantly book without leaving the feed.
  - **Travel Buddy Co-Tagging:** Tag companions and split experiences effortlessly.
- **Value-Added Addons:** Seamlessly rent local cultural attire, book vehicle rentals, and access curated local food guides alongside your stay.
- **Robust Ecosystem:**
  - **"Ask a Superhost" Mentorship:** Connect with experienced hosts for 1-on-1 guidance.
  - **"Itvara for Work":** Corporate billing and management for remote teams and retreats.
  - **Granular Privacy & Security:** Comprehensive settings to control your visibility and data.

## 🏗️ Monorepo Directory Structure

We use Turborepo and pnpm workspaces to manage our modular architecture.

```text
itvara/
├── apps/
│   ├── api/            # Modular Monolith API (Node.js/Express/NestJS)
│   ├── mobile/         # React Native/Expo mobile application
│   └── web/            # Next.js 15 App Router frontend
├── packages/
│   ├── config/         # Shared configuration (ESLint, TypeScript, Prettier)
│   ├── db/             # Prisma schema, migrations, and database client
│   ├── types/          # Shared TypeScript definitions
│   ├── ui/             # Shared React/React Native UI component library
│   └── utils/          # Shared utility functions and constants
├── docker-compose.yml  # Local development infrastructure
├── package.json        # Root workspace configuration
└── turbo.json          # Turborepo task pipeline
```

## 🛠️ Prerequisites & Tooling

Before you begin, ensure you have the following installed:
- **Node.js:** v20 or higher
- **pnpm:** v9 or higher
- **Docker & Docker Compose:** For running local infrastructure
- **Expo CLI:** For mobile development

## 🚀 Quickstart & Local Development Guide

Follow these steps to get the Itvara platform running locally.

### Step 1: Clone and Install

```bash
git clone https://github.com/itvara/itvara.git
cd itvara
pnpm install
```

### Step 2: Spin Up Infrastructure

Start the PostgreSQL (with PostGIS) and Redis containers in the background.

```bash
docker compose up -d
```

### Step 3: Database Migrations and Seeding

Apply the Prisma migrations to your local database and seed it with initial data.

```bash
pnpm --filter @itvara/db prisma migrate dev
```

### Step 4: Start Development Servers

Run the development servers for all applications and packages concurrently.

```bash
pnpm dev
```
- Web App will be available at `http://localhost:3000`
- API Server will be available at `http://localhost:8080`
- Mobile App will start the Expo bundler on port `8081`

## 🔐 Environment Variables Matrix

Create a `.env` file in the root of the respective applications. Below is the required matrix:

| Variable Name | App Target(s) | Description | Validation Rule |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `api`, `web`, `db` | Connection string for PostgreSQL/PostGIS. | Must be a valid `postgresql://` URI. |
| `REDIS_URL` | `api`, `web` | Connection string for Redis cache & Pub/Sub. | Must be a valid `redis://` or `rediss://` URI. |
| `NEXT_PUBLIC_API_URL`| `web`, `mobile` | Base URL for the Itvara API. | Valid URL (e.g., `http://localhost:8080`). |
| `JWT_SECRET` | `api` | Secret key for signing JSON Web Tokens. | Minimum 32 characters string. |
| `AWS_ACCESS_KEY_ID` | `api` | S3/Cloudflare R2 compatible access key. | Required for media uploads. |
| `AWS_SECRET_ACCESS_KEY`| `api` | S3/Cloudflare R2 compatible secret key. | Required for media uploads. |
| `STRIPE_SECRET_KEY` | `api` | Server-side Stripe API key for bookings. | Must start with `sk_test_` or `sk_live_`. |
| `NEXT_PUBLIC_STRIPE_KEY`| `web`, `mobile`| Client-side Stripe publishable key. | Must start with `pk_test_` or `pk_live_`. |
| `EXPO_PUBLIC_API_URL`| `mobile` | Exposed API URL for Expo router. | Valid URL. |

## 📜 Available Scripts

Run these scripts from the root directory using `pnpm <script>`:

- `pnpm build`: Builds all apps and packages for production.
- `pnpm dev`: Starts local development servers across the workspace.
- `pnpm test`: Runs unit tests across all projects.
- `pnpm lint`: Lints codebase using ESLint.
- `pnpm type-check`: Runs TypeScript compiler checks without emitting files.
- `pnpm test:e2e`: Executes end-to-end tests using Playwright/Cypress.

## ☁️ Deployment Overview

Itvara uses a modern, distributed cloud infrastructure setup:
- **Web (`apps/web`):** Deployed to **Vercel** for optimal Edge network delivery, SSR caching, and Next.js optimization.
- **API (`apps/api`):** Containerized and deployed to **AWS ECS** (Elastic Container Service) or **Render** for auto-scaling stateless Node.js processes.
- **Mobile (`apps/mobile`):** Built and deployed over-the-air (OTA) and to app stores via **Expo EAS** (Enterprise App Services).
- **Database:** Managed PostgreSQL instance with PostGIS enabled (e.g., AWS RDS or Supabase).
- **Storage:** **Cloudflare R2** or **AWS S3** for globally distributed media assets (images, reels).
