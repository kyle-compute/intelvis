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