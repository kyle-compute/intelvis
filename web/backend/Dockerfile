# backend/Dockerfile - PRODUCTION READY VERSION
FROM node:20-alpine

# Install necessary packages for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy the entire codebase
COPY . .

# Make the init script executable
COPY scripts/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

# Generate Prisma Client at build time (for faster startup)
RUN npx prisma generate

# Expose the port
EXPOSE 3001

# Use the initialization script
CMD ["/usr/local/bin/init.sh"]