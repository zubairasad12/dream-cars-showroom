import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

// Serves files uploaded to Netlify Blobs by /api/upload. URLs look like
// /api/files/<uniqueName> and are stored in the database, so keep this path stable.
const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string[] } }
) {
  const key = params.key.join('/');

  try {
    const store = getStore('uploads');
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });

    // Blobs returns null when the key does not exist
    if (!result?.data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const ext = key.includes('.') ? '.' + key.split('.').pop()!.toLowerCase() : '';
    const headers = new Headers();
    headers.set(
      'Content-Type',
      (result.metadata?.contentType as string) || CONTENT_TYPES[ext] || 'application/octet-stream'
    );
    // Filenames are unique (timestamp + random hex), so cache aggressively.
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(result.data, { headers });
  } catch (error) {
    console.error('File fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
