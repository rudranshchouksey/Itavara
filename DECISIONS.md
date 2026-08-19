# Architecture Decision Records (ADRs)

This document tracks all major architectural decisions for the Itvara platform.

---

## ADR-001: Monorepo Architecture with Turborepo & pnpm Workspaces

**Status:** Accepted

**Context:** Itvara requires a Web App, a Mobile App, and a Backend API. Sharing types, UI components, and utility functions is critical for maintaining consistency and developer velocity.
**Decision:** We will use a monorepo structured with pnpm workspaces and orchestrated by Turborepo.
**Consequences:**
- **Pros:** Unified CI/CD pipeline, atomic commits across frontend and backend, code sharing via `@itvara/ui` and `@itvara/types`, lightning-fast cached builds via Turborepo.
- **Cons:** Larger repository size; initial learning curve for developers unfamiliar with monorepo task orchestration.
**Alternatives Considered:** Multi-repo approach (rejected due to overhead in synchronizing shared packages and versioning).

---

## ADR-002: Next.js 15 (App Router) for Web Frontend

**Status:** Accepted

**Context:** The web platform needs exceptional SEO for public stay listings and Creator Mini-Blogs to drive organic traffic. It also requires highly interactive UI components for the booking flow.
**Decision:** Adopt Next.js 15 using the App Router.
**Consequences:**
- **Pros:** Native Server-Side Rendering (SSR) and Static Site Generation (SSG) for SEO; React Server Components (RSC) reduce client-side bundle size; robust routing layout.
- **Cons:** App Router paradigms require a paradigm shift for developers used to the older Pages router; potential caching complexities.
**Alternatives Considered:** Pure React Single Page App (Vite) (rejected due to poor SEO for content-heavy pages).

---

## ADR-003: React Native with Expo & Expo Router for Mobile

**Status:** Accepted

**Context:** We need to launch natively on both iOS and Android simultaneously without maintaining two separate codebases.
**Decision:** Use React Native combined with the Expo ecosystem (including Expo Router and EAS).
**Consequences:**
- **Pros:** Near 100% code reuse across mobile platforms; ability to share business logic and specific UI components (`@itvara/ui`) with the web; seamless OTA (Over-The-Air) updates; file-based routing via Expo Router mirrors Next.js.
- **Cons:** Performance bottleneck in extreme edge cases compared to pure Swift/Kotlin; debugging native module bridges can be complex.
**Alternatives Considered:** Native Swift/Kotlin (rejected due to resource constraints and duplication of effort); Flutter (rejected as it prevents sharing code with our React web frontend).

---

## ADR-004: PostgreSQL with PostGIS Extension for Database Layer

**Status:** Accepted

**Context:** Itvara needs strong transactional guarantees (ACID) for financial bookings and the ability to perform complex geographical distance queries for locating stays.
**Decision:** Use PostgreSQL as the primary data store and leverage the PostGIS extension for spatial data.
**Consequences:**
- **Pros:** Rock-solid reliability for pessimistic locking during checkout; native `ST_DWithin` operations for fast, indexed geographical queries; Prisma ORM supports Postgres excellently.
- **Cons:** Scaling relational databases horizontally is harder than NoSQL; requires understanding of spatial indexes.
**Alternatives Considered:** MongoDB (rejected due to weaker ACID transactional models for complex booking workflows); pure NoSQL (rejected as relational integrity is crucial for users, bookings, and payments).

---

## ADR-005: Modular Monolith Transitioning to Microservices

**Status:** Accepted

**Context:** We need to ship the MVP quickly to validate product-market fit, but we know the system will eventually experience high load requiring independent scaling of the Feed vs. Search vs. Booking.
**Decision:** Start with a Modular Monolith (well-defined internal domain boundaries) and document a clear roadmap to Microservices.
**Consequences:**
- **Pros:** Fast initial MVP delivery; greatly reduced DevOps and operational overhead; easy refactoring across domains.
- **Cons:** Risk of domains bleeding into each other if architectural discipline is not maintained.
**Alternatives Considered:** Premature distributed microservices (rejected due to high initial DevOps cost, complex distributed tracing, and slower feature delivery).

---

## ADR-006: Socket.io with Redis Pub/Sub Adapter for Real-Time Systems

**Status:** Accepted

**Context:** The platform requires real-time chat, "Ask a Superhost" room signaling, and active presence indicators across multiple server instances.
**Decision:** Implement real-time communication using Socket.io backed by a Redis Pub/Sub adapter.
**Consequences:**
- **Pros:** Fallback to long-polling if WebSockets are blocked; reliable multi-instance scaling (Redis ensures a message sent to Node A reaches a user connected to Node B); well-documented API.
- **Cons:** Stateful connections require sticky sessions on load balancers; slightly heavier than raw WebSockets.
**Alternatives Considered:** Raw WebSockets (rejected due to lack of built-in scaling/fallback); Managed services like Pusher/Ably (rejected to minimize recurring 3rd-party OPEX during early stages).

---

## ADR-007: Content-to-Commerce In-Feed Checkout Architecture

**Status:** Accepted

**Context:** Converting social feed scrollers into bookers requires minimizing friction. Redirecting users away from their feed to a separate product page drops conversion rates.
**Decision:** Implement an atomic, embedded checkout modal that floats over the feed when a `BookablePill` is clicked.
**Consequences:**
- **Pros:** Massive reduction in booking friction; users return immediately to their scroll state post-purchase; seamless integration of creator content with commerce.
- **Cons:** UI complexity in managing checkout state, payment iframes (Stripe Elements), and feed scroll position simultaneously on mobile web.
**Alternatives Considered:** Standard redirect to a Listing Details Page (rejected due to higher drop-off rates and breaking the social immersion).
