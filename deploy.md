# Production Deployment Guide

This is a complete, step-by-step guide to deploy the IntelVis application to a production server. This process uses Docker and Caddy for a containerized setup with automatic HTTPS.

## Prerequisites

1.  A DigitalOcean Droplet created from the **Docker on Ubuntu** image in the Marketplace.
    -   **Recommended Plan:** 2GB RAM / 2 CPU ($24/mo) to prevent memory issues during the build process.
2.  Your domain (`intelvis.ai`) managed by Cloudflare.
3.  Two **`A` records** in your Cloudflare DNS settings pointing your domain to the Droplet's public IP address.
    -   `@` -> `YOUR_DROPLET_IP`
    -   `www` -> `YOUR_DROPLET_IP`

## Phase 1: Initial Server Setup (One-Time Only)

These steps secure the server. You only need to do this once for a new server.

1.  SSH into your new Droplet as the `root` user:
    ```bash
    ssh root@YOUR_DROPLET_IP
    ```

2.  Create a new user to run the application (replace `kyle` with your username):
    ```bash
    adduser kyle
    ```
    (You will be prompted to set a password).

3.  Give your new user administrative (`sudo`) and Docker permissions:
    ```bash
    usermod -aG sudo kyle
    usermod -aG docker kyle
    ```

4.  Log out and log back in as your new, non-root user. **All future commands must be run as this user.**
    ```bash
    exit
    ssh kyle@YOUR_DROPLET_IP
    ```

## Phase 2: Application Deployment

This is the main deployment process. All commands are designed to be run from your user's home directory (`~`).

1.  Clone the repository:
    ```bash
    git clone https://github.com/kyle-compute/intelvis.git
    ```

2.  **Navigate into the correct project directory.** This is the most important step.
    ```bash
    cd intelvis/web
    ```

3.  **Create the production Docker Compose file.** This command writes the entire `docker-compose.prod.yml` file for you.
    ```bash
    cat > docker-compose.prod.yml << EOL
    version: '3.8'

    services:
      caddy:
        image: caddy:latest
        restart: unless-stopped
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./Caddyfile:/etc/caddy/Caddyfile
          - caddy_data:/data
          - caddy_config:/config
        depends_on:
          - frontend
          - backend

      frontend:
        build: ./frontend
        restart: unless-stopped
        environment:
          - NODE_ENV=production

      backend:
        build: ./backend
        restart: unless-stopped
        environment:
          - NODE_ENV=production
          - DATABASE_URL=postgresql://user:password@db:5432/mydb
          - PORT=3001
          - JWT_SECRET=\${JWT_SECRET}
          - PROVISIONING_API_KEY=\${PROVISIONING_API_KEY}
        depends_on:
          - db

      db:
        image: postgres:15-alpine
        restart: unless-stopped
        environment:
          - POSTGRES_USER=user
          - POSTGRES_PASSWORD=password
          - POSTGRES_DB=mydb
        volumes:
          - db_data:/var/lib/postgresql/data

    volumes:
      caddy_data:
      caddy_config:
      db_data:
    EOL
    ```

4.  **Create the `Caddyfile`** for routing and automatic HTTPS.
    ```bash
    cat > Caddyfile << EOL
    intelvis.ai {
        handle_path /api/* {
            reverse_proxy backend:3001
        }
        handle {
            reverse_proxy frontend:3000
        }
    }
    EOL
    ```

5.  **Create the `.env` file for your secrets.** Replace the placeholder values with strong, randomly generated strings.
    ```bash
    cat > .env << EOL
    JWT_SECRET=your_new_super_strong_production_jwt_secret
    PROVISIONING_API_KEY=your_new_super_strong_production_api_key
    EOL
    ```

6.  **Build and launch the application.** This will build the production images and start all containers in the background.
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```

## Phase 3: Database Setup

Your application is running, but the database is empty.

1.  **Apply all database migrations** to create your tables:
    ```bash
    docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
    ```

2.  **(Optional)** To have a test device ready immediately, **seed the database** with a pre-provisioned NIC:
    ```bash
    docker-compose -f docker-compose.prod.yml exec -T db psql -U user -d mydb -c "INSERT INTO \"Nic\" (id, mac, \"addedAt\") VALUES ('clxTESTnicID01234', 'aa:bb:cc:dd:ee:ff', NOW());"
    ```

Your site is now live and fully functional at `https://intelvis.ai`.

## How to Update the Site

To deploy new code changes from GitHub:

1.  SSH into the server as your user (`kyle`).
2.  Navigate to the project directory:
    ```bash
    cd ~/intelvis/web
    ```
3.  Pull the latest version of the code:
    ```bash
    git pull
    ```
4.  Rebuild the application images and restart the services with your new code:
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```