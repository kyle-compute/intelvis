# frontend/Dockerfile - THE FINAL, CORRECTED VERSION

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

# Receive the build argument from docker-compose
ARG NEXT_PUBLIC_API_URL

# Create a .env.local file. This is the NATIVE way Next.js finds
# build-time environment variables, bypassing any shell issues.
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.local

# The `npm run build` command will find the .env.local file and bake the URL
# directly into the final JavaScript files.
RUN npm run build

# STAGE 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]