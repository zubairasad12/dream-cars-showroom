import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// GET /api/blog/[id] — single article (admin) by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        relatedCars: { include: { brand: true, images: { take: 1 } } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Blog detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

// PUT /api/blog/[id] — update article (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      tags,
      readingTime,
      featured,
      status,
      seoTitle,
      seoDescription,
      canonicalUrl,
      publishDate,
      categoryId,
      relatedCarIds,
    } = body;

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        author,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : typeof tags === 'string' ? tags : '[]',
        readingTime: parseInt(readingTime, 10) || 5,
        featured: Boolean(featured),
        status,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        canonicalUrl: canonicalUrl || null,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        categoryId: categoryId || null,
        relatedCars: Array.isArray(relatedCarIds)
          ? { set: relatedCarIds.map((cid: string) => ({ id: cid })) }
          : undefined,
      },
      include: { category: true, relatedCars: { include: { brand: true, images: { take: 1 } } } },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Blog update error:', error);
    return NextResponse.json({ error: 'Failed to update article: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/blog/[id] — delete article (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await prisma.blogPost.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Blog delete error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
