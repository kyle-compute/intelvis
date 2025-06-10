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
    "deviceId" TEXT NOT NULL,
    "eventTs" TIMESTAMP(6) NOT NULL,
    "leakRate" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "payload" JSONB,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("deviceId","eventTs")
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
