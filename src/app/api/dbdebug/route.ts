import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Temporary diagnostics route — runs a real Prisma query and returns the
// exact error so we can see whether it's connection, auth, or missing tables.
export async function GET() {
  const result: Record<string, unknown> = {
    databaseUrlProtocol: process.env.DATABASE_URL?.split(':')[0],
    netlifyDbUrlProtocol: process.env.NETLIFY_DB_URL?.split(':')[0],
  };

  try {
    await prisma.$connect();
    result.connect = 'OK';

    const tables = await prisma.$queryRawUnsafe(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    result.tables = tables;

    const carCount = await prisma.car.count();
    result.carCount = carCount;

    const postCount = await prisma.blogPost.count();
    result.blogPostCount = postCount;
  } catch (err: any) {
    result.connect = 'FAILED';
    result.errorCode = err?.code || null;
    result.errorMessage = String(err?.message || err).slice(0, 500);
  }

  return NextResponse.json(result);
}
