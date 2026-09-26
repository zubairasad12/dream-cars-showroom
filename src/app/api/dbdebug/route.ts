import { NextResponse } from 'next/server';

// Temporary diagnostics route — reports which DB-related env keys exist at
// runtime. Returns key NAMES and protocols only, never secret values.
export async function GET() {
  const g = globalThis as unknown as {
    Netlify?: { env?: { toObject?: () => Record<string, string>; get?: (k: string) => string | undefined } };
    Deno?: { env?: object };
  };

  const netlifyEnvObject = g.Netlify?.env?.toObject?.() || null;
  const netlifyKeys = netlifyEnvObject ? Object.keys(netlifyEnvObject).filter((k) => /DB|DATABASE|NETLIFY|URL/i.test(k)) : null;

  const processKeys = Object.keys(process.env).filter((k) => /DB|DATABASE|NETLIFY|URL/i.test(k));

  const proto = (s?: string) => (s ? s.split(':')[0] + '://' + (s.includes('@') ? '***@' + s.split('@')[1].split('/')[0] : 'host') : null);

  return NextResponse.json({
    hasNetlifyGlobal: Boolean(g.Netlify),
    hasNetlifyEnv: Boolean(g.Netlify?.env),
    netlifyKeys,
    netlifyDbUrlProtocol: proto(g.Netlify?.env?.get?.('NETLIFY_DB_URL')),
    processKeys,
    processNetlifyDbUrlProtocol: proto(process.env.NETLIFY_DB_URL),
    processDatabaseUrlProtocol: proto(process.env.DATABASE_URL),
  });
}
