import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Temporary diagnostics — verify admin credentials against the production DB
export async function GET() {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const admins = await prisma.admin.findMany({ take: 5 });
    const results = admins.map((a: any) => ({
      email: a.email,
      hashPrefix: a.passwordHash?.slice(0, 7),
      hashLength: a.passwordHash?.length,
      testMatch: bcrypt.compareSync('admin123456', a.passwordHash),
    }));
    return NextResponse.json({ count: admins.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err).slice(0, 400) }, { status: 500 });
  }
}
