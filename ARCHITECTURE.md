# Itvara System Architecture

This document provides a comprehensive overview of the Itvara platform's system design, data flows, database schemas, and our strategic roadmap from a modular monolith to a microservices architecture.

## 🏗️ High-Level System Topology

Our architecture leverages a robust, scalable cloud-native approach.

```text
                     +-----------------------+
                     |   Itvara Clients      |
                     +-----------------------+
                     | - Web (Next.js 15)    |
                     | - Mobile (Expo RN)    |
                     +-----------+-----------+
                                 |
                          HTTPS / WSS (WebRTC/Socket.io)
                                 |
                     +-----------v-----------+
                     |     API Gateway       |
                     |   (Load Balancer)     |
                     +-----------+-----------+
                                 |
                 +---------------+---------------+
                 |                               |
     +-----------v-----------+       +-----------v-----------+
     |   Modular Monolith    |       |  Static Assets / CDN  |
     | (Node.js/Express/Nest)|       | (Cloudflare R2 / S3)  |
     +---+-------+-------+---+       +-----------------------+
         |       |       |
         |       |       +-------------------+
         |       |                           |
 +-------v-------v-------+       +-----------v-----------+
 |    PostgreSQL 15+     |       |      Redis Cluster    |
 |    (with PostGIS)     |       | (Caching & Pub/Sub)   |
 +-----------------------+       +-----------------------+
```

## 🔄 Core Data Flows & Sequence Diagrams

### 1. Geo-Spatial Search Flow
When a user searches for nearby stays (e.g., Ashrams or Tents):
1. **Client** sends current GPS coordinates (Latitude/Longitude) to the API.
2. **API** queries PostgreSQL utilizing the **PostGIS `ST_DWithin`** function to find accommodations within the specified radius.
3. **Caching Layer:** The API checks **Redis** for cached regional queries. If a cache miss occurs, the PostGIS query executes and the result is cached.
4. **Response:** The API calculates the dynamic "X km away" metric and returns paginated Listing Cards to the client.

### 2. Content-to-Commerce Tagging Flow
Our social engine tightly integrates with our marketplace:
1. **Creation:** A Creator uploads a Mini-Blog or Video Reel.
2. **Tagging:** During upload, the creator tags a specific Stay ID or Guide ID.
3. **Consumption:** When travelers view the feed, the UI renders a dynamic `BookablePill` overlay on the media.
4. **Interaction:** The traveler clicks the pill, opening an **Atomic Checkout Modal** without navigating away from the feed.
5. **Fulfillment:** Upon booking confirmation, the smart contract/backend automatically credits the Creator's Wallet with an affiliate commission.

### 3. Atomic Booking & Lock Flow
To prevent double-booking of unique inventory (like a specific Monastery room):
1. **Checkout Initiation:** The traveler selects dates and clicks "Book".
2. **Pessimistic Lock:** The API executes a `SELECT ... FOR UPDATE` query in PostgreSQL on the specific listing's availability rows for the requested dates. This ensures no concurrent transactions can claim the same dates.
3. **Payment Processing:** A checkout session is created and the client completes the payment.
4. **Webhook Verification:** Stripe/Payment Gateway sends a webhook confirming the charge.
5. **Confirmation:** The transaction is committed, dates are marked unavailable, and a PDF invoice is dispatched via email/SQS.

### 4. Real-Time Communication Flow
For "Ask a Superhost" mentorship calls and travel buddy chats:
1. **Connection:** Clients connect to the **Socket.io** cluster.
2. **Scaling:** The **Redis Pub/Sub Adapter** ensures messages and events are broadcasted correctly across multiple stateless API instances.
3. **Signaling:** For audio/video mentorship calls, Socket.io handles the WebRTC signaling handshake (SDP offers/answers and ICE candidates).
4. **P2P:** Once signaled, clients establish a direct WebRTC peer-to-peer connection for low-latency communication.

## 🗄️ Database Schema Architecture

The relational schema is designed for ACID compliance and geographical indexing.

- **Users:** Core identity, auth credentials, roles (Traveler, Host, Creator, Corporate Admin).
- **Profiles & Wallets:** Linked to Users. Wallets track affiliate commissions from content tagging.
- **Listings:** Base table for accommodations (Monasteries, Work Studios, etc.). Contains a `geometry(Point, 4326)` column for PostGIS.
- **Bookings:** Tracks reservation dates, total cost, status, and foreign keys to Users and Listings.
- **AddOns:** Represents cultural attire, vehicles, and food guides. Linked to Bookings via a many-to-many join table (`BookingAddOns`).
- **Posts (Mini-Blogs/Reels):** Contains media URLs, text content, and author references.
- **Tags (Content-to-Commerce):** Polymorphic join table linking Posts to specific Listings, Guides, or AddOns.
- **MentorshipSessions:** Tracks scheduled "Ask a Superhost" slots and WebRTC room IDs.
- **CorporateAccounts:** Enables "Itvara for Work" features, linking multiple employees to a central billing entity.

## 🛡️ Security & Rate-Limiting Architecture

- **Multi-Tier Rate Limiting:** Implemented via Redis. Global IP limits + stricter endpoint-specific limits (e.g., login, checkout).
- **Authentication:** OAuth2/OIDC with JWT access tokens and HTTP-only, secure refresh tokens. JWTs are rotated automatically.
- **MFA:** TOTP (Time-Based One-Time Password) 2FA flow mandated for Hosts and Corporate Admins.
- **Privacy Keyword Sanitation:** A real-time pipeline (Regex + NLP) sanitizes private information (phone numbers, addresses) in public Mini-Blogs and chats before persistence.

## 🛤️ Future Microservices Decoupling Roadmap

While currently a Modular Monolith (for velocity and simplicity), the system is architected along domain boundaries to allow seamless extraction into microservices:

1. **Phase 1: Search & PostGIS Service (Go):** Extract the geo-spatial query engine. Go's concurrency will handle high-volume map pan/zoom requests optimally.
2. **Phase 2: Social Feed Service (Node.js):** Separate the content delivery, reel streaming, and tagging aggregation to scale independently of the marketplace.
3. **Phase 3: Booking & Payment Service (Node.js/TypeScript):** Isolate checkout, pessimistic locking, and Stripe webhook handling to ensure highest availability and compliance (PCI-DSS).
4. **Phase 4: Real-Time Messaging Service (Go/Elixir):** Move Socket.io/WebRTC signaling to a highly concurrent stack for massive chat scale.
