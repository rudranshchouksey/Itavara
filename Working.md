# Itvara Platform Working & Architecture

## Overview
**Itvara** is a next-generation platform combining a hybrid accommodation marketplace with a social discovery engine. It enables users to discover unique stays (e.g., Monasteries, Ashrams, Hostels) while natively supporting social content like mini-blogs and video reels. 

The most powerful feature is its **Content-to-Commerce** engine, allowing creators to tag stays and guides in their posts, which users can click to book seamlessly without leaving the feed.

## System Architecture

The project is structured as a **Monorepo** using **Turborepo** and **pnpm workspaces**. 

### Applications (`apps/`)
- **`web/`**: Next.js 15 (App Router) frontend designed for high SEO and server-side rendering.
- **`mobile/`**: React Native mobile app powered by Expo and Expo Router.
- **`api/`**: A Node.js modular monolith backend handling business logic, webhooks, and realtime communications.

### Packages (`packages/`)
- **`db/`**: Centralized database definitions using Prisma ORM.
- **`ui/`**: Shared React/React Native components.
- **`config/`, `types/`, `utils/`**: Shared logic, TypeScript interfaces, and linting rules.

## Core Workflows & Engineering Mechanics

### 1. Geo-Spatial Search (PostgreSQL + PostGIS)
To power proximity-based search (e.g. "Find tents within 50km"):
- The API receives user coordinates.
- It queries the database using **PostGIS** functions (like `ST_DWithin`) against the `location` field `geometry(Point, 4326)` in the `Listing` model.
- These expensive geographical queries are cached heavily using **Redis** to improve performance and scale.

### 2. Content-to-Commerce Tagging
The link between social media and marketplace transactions:
- **Creation**: Users create a `Post` (REEL, MINI_BLOG, PHOTO) and attach a `Tag` referencing a specific `ListingId` or `GuideId`. 
- **Consumption**: When viewed in the feed, this `Tag` renders as a `BookablePill`.
- **Atomic Checkout**: Tapping the pill triggers an inline checkout modal, utilizing Stripe Elements, without disrupting the scrolling experience.
- **Incentives**: Successful bookings distribute affiliate commissions to the creator’s `Wallet`.

### 3. Atomic Booking & Concurrency Control
Since inventory is often unique (e.g., a specific room in a mansion):
- The platform employs a **Pessimistic Lock** mechanism via `SELECT ... FOR UPDATE` in PostgreSQL during the checkout phase.
- This strictly guarantees that no two concurrent users can book the same dates for a specific listing, preserving ACID transactional integrity.

### 4. Real-Time Communication
For features like "Ask a Superhost" mentorship, chat, and travel buddy interactions:
- Connections run over **Socket.io** utilizing a **Redis Pub/Sub adapter** to scale across multiple Node.js instances.
- Mentorship calls involve **WebRTC** signaling over these sockets to negotiate peer-to-peer audio/video connections.

## Database Schema (Prisma)

The centralized PostgreSQL schema (`packages/db/prisma/schema.prisma`) represents the entire domain of Itvara:

- **Users & Identities**: Handles authentication, profile info, and `Role` (GUEST, HOST, SUPERHOST, TRAVEL_ADMIN). Includes settings for notifications and privacy.
- **Marketplace**: 
  - `Listing`: Accommodations with geospatial fields.
  - `GuideProfile` & `RentalItem`: Add-on marketplace for local guides, attire, and vehicles.
- **Social Engine**: 
  - `Post`, `Tag`, `Comment`, `Like` representing the feed.
  - `TravelBuddyTag` allowing users to co-tag friends on trips.
- **Transactions & Bookings**: 
  - `Booking`, `AddOn`, `Transaction` representing the core commerce engine.
  - `Wallet` & `WalletTransaction` for handling creator commissions and host payouts.
- **Corporate Accounts**: Models like `CorporateAccount` and `CorporateEmployee` support the "Itvara for Work" offering, allowing companies to set `CorporateBookingPolicy` limits for employee travel.
- **Ads & Sponsorships**: `SponsoredCampaign` and `AdInteraction` for hosts wanting to boost listings in search or social feeds.

## Future Roadmap (Microservices)
Currently built as a Modular Monolith for speed of delivery, the system has strict domain boundaries (Search, Social, Booking, Real-time) built-in to facilitate future extraction into independent microservices (e.g., extracting the PostGIS search into a Go service, and Real-time into Go/Elixir).
