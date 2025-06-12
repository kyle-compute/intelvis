#!/bin/sh
# scripts/init.sh - Backend initialization script

set -e

echo "Starting backend initialization..."

# Wait for database to be ready (optional, since docker-compose handles this)
echo "Waiting for database connection..."

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client (redundant if done in Dockerfile, but safe)
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting backend server..."
exec npm start