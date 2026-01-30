
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY client/package*.json ./
COPY shared-lib/package*.json ../shared-lib/

COPY client ./
COPY shared-lib ../shared-lib
RUN npm ci --legacy-peer-deps
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/client/browser/ /usr/share/nginx/html/
COPY client/default.conf /etc/nginx/conf.d/000-angular.conf


EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
