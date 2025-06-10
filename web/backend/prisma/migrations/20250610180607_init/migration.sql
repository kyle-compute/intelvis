-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DECOMMISSIONED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nic" (
    "id" TEXT NOT NULL,
    "mac" TEXT NOT NULL,
    "deviceId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "parentId" TEXT,
    "path" TEXT,
    "alias" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "nicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "id" BIGSERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "eventTs" TIMESTAMP(6) NOT NULL,
    "leakRate" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "payload" JSONB,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Nic_mac_key" ON "Nic"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "Nic_deviceId_key" ON "Nic"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_nicId_key" ON "Device"("nicId");

-- CreateIndex
CREATE INDEX "Device_ownerId_status_idx" ON "Device"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Telemetry_deviceId_eventTs_idx" ON "Telemetry"("deviceId", "eventTs" DESC);

-- CreateIndex
CREATE INDEX "Telemetry_ownerId_eventTs_idx" ON "Telemetry"("ownerId", "eventTs" DESC);

-- AddForeignKey
ALTER TABLE "Nic" ADD CONSTRAINT "Nic_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "device_parent_id_fkey" FOREIGN KEY ("parentId") REFERENCES "Device"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- This SQL enhances the basic schema created by Prisma.
-- Run this AFTER `prisma migrate dev` completes.

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS ltree;

-- 2. Alter the 'path' column from TEXT to the powerful LTREE type
ALTER TABLE "Device" ALTER COLUMN "path" TYPE ltree USING "path"::ltree;

-- 3. Now that the column is the correct type, create the fast GiST index on it
CREATE INDEX "Device_path_idx" ON "Device" USING GIST ("path");

-- 4. Convert the Telemetry table into a TimescaleDB hypertable
SELECT create_hypertable('"Telemetry"', 'eventTs');

-- 5. Create the trigger function to automatically manage the `path` column
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

-- 6. Attach the trigger to the Device table
CREATE TRIGGER trg_device_path_update
BEFORE INSERT OR UPDATE OF parentId ON "Device"
FOR EACH ROW EXECUTE PROCEDURE update_device_path();