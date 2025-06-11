// backend/lib/db.js
import { PrismaClient } from '@prisma/client';

// This pattern ensures that in a development environment (where module caching can be flushed),
// you don't end up with a bunch of orphaned connections.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;