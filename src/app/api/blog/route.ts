import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// GET /api/blog — public list (published only) or admin list (all statuses)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const skip = (page - 1) * limit;

    const admin = getAdminFromRequest(req);
    const where: any = {};

    // Public visitors only ever see Published articles
    if (admin) {
      if (status && status !== 'all') {
        where.status = status;
      }
    } else {
      where.status = 'Published';
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
        { category: { name: { contains: q } } },
      ];
    }

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          _count: { select: { relatedCars: true } },
        },
        orderBy: { publishDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error: any) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/blog — create article (admin)
export async function POST(req: NextRequest) {
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

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const finalSlug =
      slug && slug.trim()
        ? slug.trim()
        : title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

    // Enforce unique slug
    const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { error: 'An article with this slug already exists. Please choose another.' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || null,
        author: author || 'Dream Cars Team',
        tags: Array.isArray(tags) ? JSON.stringify(tags) : typeof tags === 'string' ? tags : '[]',
        readingTime: parseInt(readingTime, 10) || 5,
        featured: Boolean(featured),
        status: status || 'Draft',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        canonicalUrl: canonicalUrl || null,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        categoryId: categoryId || null,
        relatedCars: Array.isArray(relatedCarIds) && relatedCarIds.length > 0
          ? { connect: relatedCarIds.map((cid: string) => ({ id: cid })) }
          : undefined,
      },
      include: { category: true, relatedCars: { include: { brand: true, images: { take: 1 } } } },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Failed to create article: ' + error.message }, { status: 500 });
  }
}
