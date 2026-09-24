import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = params;
    const { name, logo, description, active } = await req.json();

    const data: any = {};
    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (logo !== undefined) data.logo = logo;
    if (description !== undefined) data.description = description;
    if (active !== undefined) data.active = Boolean(active);

    const brand = await prisma.brand.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    console.error('Brand PUT error:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = params;
    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Brand deleted' });
  } catch (error: any) {
    console.error('Brand DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
