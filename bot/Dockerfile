FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/out out
EXPOSE 3001
CMD [ "node", "out/index.js" ]