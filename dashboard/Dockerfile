FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.21-alpine
ENV NODE_ENV=production
RUN mkdir /app
COPY --from=builder /app/build /app
COPY --from=builder /app/scripts/* /docker-entrypoint.d
COPY nginx.conf /etc/nginx/nginx.conf
