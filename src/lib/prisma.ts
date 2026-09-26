import { PrismaClient } from '@prisma/client';

// Netlify DB injects NETLIFY_DB_URL (hosted Postgres) into deployed functions.
// Point Prisma at it so the runtime never falls back to the local .env value.
if (process.env.NETLIFY_DB_URL) {
  process.env.DATABASE_URL = process.env.NETLIFY_DB_URL;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
