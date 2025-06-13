#!/bin/bash

echo "=== Starting continuous monitoring ==="
echo "Frontend URL: http://localhost:8080"
echo "Docker containers status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n=== Running initial build test ==="
docker exec web-frontend-1 npm run build

echo -e "\n=== Running lint check ==="
docker exec web-frontend-1 npm run lint

echo -e "\n=== Monitor setup complete ==="
echo "Docker containers are running. Frontend is accessible at http://localhost:8080"
echo "To stop containers: docker compose -f docker-compose.dev.yml down"
echo "To rebuild: docker exec web-frontend-1 npm run build"