# Project Architecture & Development Guide

This document outlines the database schema, local development environment, and operational workflows for this IoT application. It is designed to help onboard new developers and serve as a reference to prevent technical debt.

The architecture is built on three core principles:
1.  **Scalability:** The database is designed to handle billions of telemetry data points efficiently using TimescaleDB.
2.  **Maintainability:** The clear separation between logical devices and physical hardware simplifies board swaps and long-term management.
3.  **Reproducibility:** The development environment is fully containerized with Docker, ensuring consistency between local machines and production.

---

## 1. Database Schema Design

The schema is managed by Prisma and built on PostgreSQL, enhanced with the **TimescaleDB** and **ltree** extensions.

### Key Concepts

*   **Logical `Device` vs. Physical `Nic`:** We separate a device's permanent identity (`Device` model) from the physical hardware (`Nic` model, identified by MAC address). When a physical board fails, we simply link the existing `Device` to a new `Nic`. The device's history and its position in the tree remain intact.
*   **Time-Series Telemetry:** The `Telemetry` table is a TimescaleDB **hypertable**. This partitions data automatically by time, making writes, queries, and data retention policies extremely fast and efficient at scale.
*   **Hierarchical Tree with `ltree`:** The parent-child relationships between devices are managed using PostgreSQL's `ltree` type. This allows for very fast queries on the device hierarchy (e.g., "get all sensors under this master node") without slow, recursive SQL queries.

### Prisma Schema (`prisma/schema.prisma`)

This is the single source of truth for the database structure.

```prisma
// This schema defines the database structure for the application.
// It is managed by Prisma ORM.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ---------- METADATA ----------

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  devices   Device[]
}

// Immutable physical interface (the actual hardware board)
model Nic {
  id        String   @id @default(cuid())
  mac       String   @unique
  deviceId  String?  @unique // A NIC can only be in one device at a time
  device    Device?  @relation(fields: [deviceId], references: [id], onDelete: SetNull)
  addedAt   DateTime @default(now())
}

enum DeviceStatus {
  ACTIVE
  INACTIVE
  DECOMMISSIONED
}

// Logical node in the device tree
model Device {
  id        String   @id @default(cuid())
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  parentId  String?
  parent    Device?  @relation("DeviceTree", fields: [parentId], references: [id], onDelete: NoAction)
  children  Device[] @relation("DeviceTree")

  // The 'path' uses a native PostgreSQL type not directly supported by Prisma,
  // but Prisma will create it as a `text` column. A manual trigger manages this.
  path      String?  @db.Unsupported("ltree")
  alias     String?
  status    DeviceStatus @default(ACTIVE)

  // Foreign key to the current physical hardware (NIC)
  nicId     String?  @unique
  nic       Nic?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Telemetry Telemetry[]

  @@index([ownerId, status])
  @@index([path], type: Gist)
}

// ---------- TELEMETRY (TIME-SERIES DATA) ----------

model Telemetry {
  id        BigInt   @id @default(autoincrement())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id], onDelete: Cascade)
  
  eventTs   DateTime @db.Timestamp(6)
  leakRate  Float    @db.DoublePrecision
  pressure  Float    @db.DoublePrecision
  payload   Json?

  // Denormalized for faster queries on the hypertable
  ownerId   String

  @@index([deviceId, eventTs(sort: Desc)])
  @@index([ownerId, eventTs(sort: Desc)])
}
```
# Manual SQL for Advanced Features

## Prisma does not manage TimescaleDB or ltree triggers. These SQL commands must be applied to the database after Prisma creates the initial tables. The recommended way is to add them to the end of the first generated migration.sql file.
```
-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS ltree;

-- 2. Convert the Telemetry table into a TimescaleDB hypertable
-- This partitions the table by time for massive performance gains.
SELECT create_hypertable('"Telemetry"', 'eventTs', chunk_time_interval => interval '7 days');

-- 3. Create the trigger function to automatically manage the `path` column for the device tree
CREATE OR REPLACE FUNCTION update_device_path() RETURNS trigger AS $$
  BEGIN
    IF NEW.parentId IS NULL THEN
      NEW.path = text2ltree(NEW.id);
    ELSE
      SELECT D.path || text2ltree(NEW.id)
      INTO NEW.path
      FROM "Device" AS D
      WHERE D.id = NEW.parentId;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- 4. Attach the trigger to the Device table
CREATE TRIGGER trg_device_path_update
BEFORE INSERT OR UPDATE OF parentId ON "Device"
FOR EACH ROW EXECUTE PROCEDURE update_device_path();

-- 5. (OPTIONAL BUT RECOMMENDED) Create continuous aggregate for fast dashboard queries
CREATE MATERIALIZED VIEW telemetry_hourly
WITH (timescaledb.continuous) AS
SELECT
  "ownerId",
  "deviceId",
  time_bucket('1 hour', "eventTs") AS hour,
  AVG("leakRate") AS leak_avg,
  MAX("leakRate") AS leak_peak,
  MIN("leakRate") AS leak_min
FROM "Telemetry"
GROUP BY "ownerId", "deviceId", hour;
```
# 2. Local Development Environment with Docker

## We use Docker Compose to run the entire application stack (db, backend, frontend) in isolated containers. This creates a consistent and reproducible environment.

# Expected project Structure

```
/project-root
├── docker-compose.yml
├── .env
├── /backend
│   ├── Dockerfile
│   ├── package.json
│   └── /prisma
│       └── schema.prisma
└── /frontend
    ├── Dockerfile
    └── package.json
```
# Envrionment Variables (.env)

## The .env file in the project root holds configuration for both the Docker containers and your local tools.

```
# .env

# --- For Docker Compose ---
# This URL is used by the backend CONTAINER to talk to the db CONTAINER.
# Notice the hostname is 'db', the service name from docker-compose.yml.
DATABASE_URL_DOCKER="postgresql://user:password@db:5432/mydb?schema=public"
JWT_SECRET="your-super-secret-key-for-jwt"


# --- For Your Local Machine ---
# This URL is used by your LOCAL tools (Prisma Studio, TablePlus, etc.)
# to talk to the database exposed on localhost.
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

# Docker Compose config (docker-compose.yml)

## This file deifnes all services and how they connect

version: '3.8'

services:
  # 1. The Database Service
  db:
    image: timescale/timescaledb-ha:pg16-ts3.13
    container_name: iot-db
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    ports:
      - '5432:5432' # Expose to host machine for local tools
    volumes:
      - db_data:/var/lib/postgresql/data

  # 2. The Backend Service (Node.js/Express)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: iot-backend
    restart: always
    ports:
      - '3001:3001'
    depends_on:
      - db # Wait for the database to be ready
    environment:
      # CRITICAL: Reads from .env file and uses the Docker-specific URL
      - DATABASE_URL=${DATABASE_URL_DOCKER}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
      - /app/node_modules # Prevents host node_modules from hiding container's

  # 3. The Frontend Service (React/Vite/Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: iot-frontend
    restart: always
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  db_data: