# Multi-stage build for NestJS server
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY server/package*.json ./
COPY shared-lib/package*.json ../shared-lib/

# Copy entire source directories
COPY server ./
COPY shared-lib ../shared-lib

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the server application
RUN npm run build

# Stage 2: Prune dependencies for production
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Copy the built application from builder
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Stage 3: Runtime
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy application from builder
COPY --from=builder /app/dist ./dist

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy .env file (can be overridden at runtime)
COPY server/apps/core/sample.env ./.env

# Expose ports
EXPOSE 3000 3002

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
