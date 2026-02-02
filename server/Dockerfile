# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared-lib ./shared-lib

WORKDIR /app/shared-lib
RUN npm i && npm run build

WORKDIR /app/server
COPY server/package*.json ./
COPY server/tsconfig*.json ./
COPY server/nx.json ./
COPY server/apps ./apps

RUN npm i

# Build the application
RUN npx nx build core --prod

# Production stage
FROM node:20-alpine AS production

WORKDIR /app/server
COPY server/package*.json ./
RUN npm i --omit=dev

# Copy built application from builder
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/shared-lib ../shared-lib

# Expose the port
EXPOSE 3000 3002

# Start the application
CMD ["node", "dist/apps/core/main.js"]
