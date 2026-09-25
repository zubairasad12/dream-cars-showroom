import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// PUT /api/blog/categories/[id] — update category (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { name, slug, description } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await prisma.blogCategory.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug: slug && slug.trim() ? slug.trim() : undefined,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Blog category PUT error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/blog/categories/[id] — delete category (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    // Posts keep existing but category reference is set to null (onDelete: SetNull)
    await prisma.blogCategory.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    console.error('Blog category DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
