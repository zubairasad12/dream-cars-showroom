import { PrismaClient } from '@prisma/client';

// Netlify DB injects NETLIFY_DB_URL (hosted Postgres) into deployed functions
// via the global Netlify.env object — NOT process.env. Resolve it from either
// source and point Prisma's DATABASE_URL at it so the runtime never falls
// back to the local .env placeholder.
const g = globalThis as unknown as {
  Netlify?: { env?: { get?: (key: string) => string | undefined } };
};

const netlifyDbUrl =
  g.Netlify?.env?.get?.('NETLIFY_DB_URL') || process.env.NETLIFY_DB_URL;

if (netlifyDbUrl) {
  process.env.DATABASE_URL = netlifyDbUrl;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
