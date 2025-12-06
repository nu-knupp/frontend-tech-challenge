# Multi-stage build for Next.js microfrontends
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Set working directory
WORKDIR /app

# Internal dashboard URL for production builds (Docker network)
ENV DASHBOARD_INTERNAL_URL=http://dashboard:3002

# Copy package files for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files with proper structure
COPY apps/banking/package.json ./apps/banking/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/shared-components/package.json ./packages/shared-components/
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/shared-hooks/package.json ./packages/shared-hooks/
COPY packages/shared-services/package.json ./packages/shared-services/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ts-config/package.json ./packages/ts-config/
COPY packages/eslint-config-custom/package.json ./packages/eslint-config-custom/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared packages first
RUN pnpm build --filter="@banking/shared-*"

# Build stage for banking app
FROM base AS banking-builder
RUN pnpm build --filter=banking

# Build stage for dashboard app  
FROM base AS dashboard-builder
RUN pnpm build --filter=dashboard

# Production stage for banking
FROM node:20-alpine AS banking-production
RUN npm install -g pnpm@10.14.0
RUN apk add --no-cache curl
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/banking/package.json ./apps/banking/
COPY packages/shared-components/package.json ./packages/shared-components/
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/shared-hooks/package.json ./packages/shared-hooks/
COPY packages/shared-services/package.json ./packages/shared-services/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ts-config/package.json ./packages/ts-config/

# Install dependencies (include all deps for shared packages)
RUN pnpm install --frozen-lockfile

# Copy built application
COPY --from=banking-builder /app/apps/banking/.next apps/banking/.next
COPY --from=banking-builder /app/apps/banking/public apps/banking/public
COPY --from=banking-builder /app/apps/banking/next.config.js apps/banking/
COPY --from=banking-builder /app/packages packages

EXPOSE 3000
CMD ["pnpm", "--filter", "banking", "start"]

# Production stage for dashboard
FROM node:20-alpine AS dashboard-production
RUN npm install -g pnpm@10.14.0
RUN apk add --no-cache curl
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/shared-components/package.json ./packages/shared-components/
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/shared-hooks/package.json ./packages/shared-hooks/
COPY packages/shared-services/package.json ./packages/shared-services/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/ts-config/package.json ./packages/ts-config/

# Install dependencies (include all deps for shared packages)
RUN pnpm install --frozen-lockfile

# Copy built application
COPY --from=dashboard-builder /app/apps/dashboard/.next apps/dashboard/.next
COPY --from=dashboard-builder /app/apps/dashboard/public apps/dashboard/public
COPY --from=dashboard-builder /app/apps/dashboard/next.config.js apps/dashboard/
COPY --from=dashboard-builder /app/packages packages

EXPOSE 3002
CMD ["pnpm", "--filter", "dashboard", "start"]

# JSON Server stage
FROM node:20-alpine AS json-server
RUN apk add --no-cache curl
WORKDIR /app

# Install json-server globally
RUN npm install -g json-server

# Create public directory for json-server
RUN mkdir -p public

# Copy database files
COPY db/ ./db/
COPY scripts/initServerJson.js ./scripts/

# Initialize server.json
RUN node scripts/initServerJson.js

EXPOSE 3001
CMD ["json-server", "--watch", "db/server.json", "--port", "3001", "--host", "0.0.0.0"]
