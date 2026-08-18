FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
RUN yarn global add pnpm turbo

# Copy monorepo to leverage turborepo pruning
COPY . .

# Generate a partial monorepo with a pruned lockfile for the api package
RUN turbo prune --scope=@itvara/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
WORKDIR /app
RUN yarn global add pnpm

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch
RUN pnpm install --frozen-lockfile --offline

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@itvara/api...

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy over node_modules and built dist folder
COPY --from=installer /app/apps/api/package.json .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=installer /app/packages/db/dist ./packages/db/dist
COPY --from=installer /app/packages/config/dist ./packages/config/dist
COPY --from=installer /app/packages/types/dist ./packages/types/dist
COPY --from=installer /app/packages/utils/dist ./packages/utils/dist

ENV NODE_ENV production
ENV PORT 4000
EXPOSE 4000

CMD ["node", "dist/server.js"]
