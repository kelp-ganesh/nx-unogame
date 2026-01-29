FROM node:20-alpine AS build

WORKDIR /workspace


COPY . .
RUN cd client && npm ci --legacy-peer-deps && npx nx build client --configuration=production

FROM nginx:stable-alpine AS runtime
COPY --from=build /workspace/client/dist/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]