# Daily Development Workflow

## Use these commands from the project root directory

### 1. start all services
`docker-compose up -d --build`

### 2. run database migrations (migrations must be run in backend container)
`docker-compose exec backend npx prisma migrate dev --name your-migration-name`

### 3. View the database with Prisma Studio: (This command is run from your local machine and uses the DATABASE_URL from your .env file.)
`npx prisma studio`

### 4. view logs for specific service
`docker-compose logs -f backend  # Or 'db', 'frontend'`

### 5. stop all  services
`docker-compose down`

# Production deployment strategy

## Database: Use a managed database service that supports TimescaleDB, like DigitalOcean's Managed TimescaleDB.
 
## Migrations: DO NOT use prisma migrate dev in production. Use the production-safe command in your deployment pipeline:
`npx prisma migrate deploy`

Environment Variables: Securely provide the production DATABASE_URL and other secrets to your deployed backend application`

      
