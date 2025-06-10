// /web/backend/lib/db.js

import { PrismaClient } from '@prisma/client';

// This prevents Prisma from creating new connections on every hot-reload in development.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

// This ensures there is only one instance of Prisma Client.
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;