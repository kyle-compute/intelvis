# backend/Dockerfile - PRODUCTION READY VERSION
FROM node:20-alpine

# Install necessary packages for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --omit=dev || npm ci --production || npm install --production

# Copy the entire codebase
COPY . .

# Generate Prisma Client at build time (for faster startup)
RUN npx prisma generate

# Expose the port
EXPOSE 3001

# Start the application directly
CMD ["node", "index.js"]