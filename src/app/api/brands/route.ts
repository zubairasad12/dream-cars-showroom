import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where: any = {};
    if (activeOnly) {
      where.active = true;
    }

    const brands = await prisma.brand.findMany({
      where,
      include: {
        _count: {
          select: { cars: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error('Brands GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { name, logo, description, active } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: 'A brand with this name already exists' }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo: logo || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80',
        description: description || '',
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error: any) {
    console.error('Brand POST error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
