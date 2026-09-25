import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv'];
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB per video file

// Cloudinary (optional) — when configured, uploads go to the cloud so they
// persist on serverless hosts like Netlify where the filesystem is read-only.
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const useCloudinary = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);

async function uploadToCloudinary(file: File, buffer: Buffer): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(buffer)], { type: file.type || 'application/octet-stream' }), file.name);
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET as string);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  return json.secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Local disk target (development only)
    let uploadDir: string | null = null;
    if (!useCloudinary) {
      uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      if (!file || typeof file === 'string' || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = (path.extname(file.name) || '').toLowerCase();
      const isVideo =
        VIDEO_EXTS.includes(ext) || (file.type && file.type.startsWith('video/'));

      if (isVideo && buffer.byteLength > MAX_VIDEO_BYTES) {
        return NextResponse.json(
          { error: `Video "${file.name}" is larger than 100 MB. Please compress it first.` },
          { status: 400 }
        );
      }

      if (useCloudinary) {
        const url = await uploadToCloudinary(file, buffer);
        uploadedUrls.push(url);
        continue;
      }

      // Local filesystem fallback
      let safeExt: string;
      if (isVideo) {
        safeExt = VIDEO_EXTS.includes(ext) ? ext : '.mp4';
      } else {
        safeExt = IMAGE_EXTS.includes(ext) ? ext : '.jpg';
      }

      const uniqueName = `dreamcars-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
      const filePath = path.join(uploadDir as string, uniqueName);

      await fs.writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload: ' + error.message },
      { status: 500 }
    );
  }
}
