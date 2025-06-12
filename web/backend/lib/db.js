// backend/lib/db.js  (or prisma.js)

import { PrismaClient } from '@prisma/client';

// keep one instance in dev to avoid “too many clients” hot-reload leaks
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;               // default ESM export