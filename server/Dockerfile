FROM node:20-alpine AS build

WORKDIR /workspace

COPY . .
RUN cd server && npm ci --legacy-peer-deps
RUN npx nx build core --configuration=production

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /workspace/dist/apps/core .
COPY server/package*.json ./
RUN npm ci --production --legacy-peer-deps
EXPOSE 3000
EXPOSE 3002
CMD ["node", "main.js"]