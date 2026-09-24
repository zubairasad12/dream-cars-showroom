import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const model = searchParams.get('model') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const year = searchParams.get('year');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const bodyType = searchParams.get('bodyType');
    const condition = searchParams.get('condition');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { model: { contains: search } },
        { brand: { name: { contains: search } } },
        { description: { contains: search } },
        { exteriorColor: { contains: search } },
      ];
    }

    if (brand && brand !== 'all') {
      where.OR = [
        { brandId: brand },
        { brand: { slug: brand } },
        { brand: { name: { contains: brand } } },
      ];
    }

    if (model) {
      where.model = { contains: model };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (year) {
      where.year = parseInt(year, 10);
    }

    if (fuelType && fuelType !== 'all') {
      where.fuelType = { contains: fuelType };
    }

    if (transmission && transmission !== 'all') {
      where.transmission = { contains: transmission };
    }

    if (bodyType && bodyType !== 'all') {
      where.bodyType = { contains: bodyType };
    }

    if (condition && condition !== 'all') {
      where.condition = { contains: condition };
    }

    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'mileage-asc') {
      orderBy = { mileage: 'asc' };
    } else if (sort === 'year-desc') {
      orderBy = { year: 'desc' };
    }

    const [total, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        include: {
          brand: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      cars,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error: any) {
    console.error('Cars GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      brandId,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      engine,
      horsepower,
      bodyType,
      condition,
      exteriorColor,
      interiorColor,
      driveType,
      description,
      features,
      featured,
      status,
      images,
    } = body;

    if (!brandId || !model || !year || !price) {
      return NextResponse.json(
        { error: 'Brand, model, year, and price are required fields' },
        { status: 400 }
      );
    }

    const car = await prisma.car.create({
      data: {
        brandId,
        model,
        year: parseInt(year, 10),
        price: parseFloat(price),
        mileage: parseInt(mileage || '0', 10),
        fuelType: fuelType || 'Petrol',
        transmission: transmission || 'Automatic',
        engine: engine || 'V8',
        horsepower: parseInt(horsepower || '300', 10),
        bodyType: bodyType || 'Sedan',
        condition: condition || 'Brand New',
        exteriorColor: exteriorColor || 'Black',
        interiorColor: interiorColor || 'Black Leather',
        driveType: driveType || 'AWD',
        description: description || '',
        features: Array.isArray(features) ? JSON.stringify(features) : (typeof features === 'string' ? features : '[]'),
        featured: Boolean(featured),
        status: status || 'Available',
      },
    });

    if (Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images.map((img: any, index: number) =>
          prisma.carImage.create({
            data: {
              carId: car.id,
              imageUrl: typeof img === 'string' ? img : img.imageUrl,
              isPrimary: typeof img === 'object' && img.isPrimary !== undefined ? img.isPrimary : index === 0,
              sortOrder: typeof img === 'object' && img.sortOrder !== undefined ? img.sortOrder : index,
            },
          })
        )
      );
    }

    const fullCar = await prisma.car.findUnique({
      where: { id: car.id },
      include: { brand: true, images: true },
    });

    return NextResponse.json({ success: true, car: fullCar }, { status: 201 });
  } catch (error: any) {
    console.error('Car creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create car: ' + error.message },
      { status: 500 }
    );
  }
}
