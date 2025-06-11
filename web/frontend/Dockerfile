# frontend/Dockerfile - THIS IS THE ONLY CORRECT VERSION
# STAGE 1: Dependency Installation
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# STAGE 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.local
RUN npm run build

# STAGE 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
# This copies the standalone server output
COPY --from=builder /app/.next/standalone ./
# This copies the static assets
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
# This runs the production server
CMD ["node", "server.js"]