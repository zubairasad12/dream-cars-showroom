import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error: any) {
    console.error('Car detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

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

    const car = await prisma.car.update({
      where: { id },
      data: {
        brandId,
        model,
        year: parseInt(year, 10),
        price: parseFloat(price),
        mileage: parseInt(mileage, 10),
        fuelType,
        transmission,
        engine,
        horsepower: parseInt(horsepower, 10),
        bodyType,
        condition,
        exteriorColor,
        interiorColor,
        driveType,
        description,
        features: Array.isArray(features) ? JSON.stringify(features) : (typeof features === 'string' ? features : '[]'),
        featured: Boolean(featured),
        status,
      },
    });

    // If images array is provided, replace or sync car images
    if (Array.isArray(images)) {
      // Remove old images
      await prisma.carImage.deleteMany({
        where: { carId: id },
      });

      // Insert updated images
      await Promise.all(
        images.map((img: any, index: number) =>
          prisma.carImage.create({
            data: {
              carId: id,
              imageUrl: typeof img === 'string' ? img : img.imageUrl,
              isPrimary: typeof img === 'object' && img.isPrimary !== undefined ? img.isPrimary : index === 0,
              sortOrder: typeof img === 'object' && img.sortOrder !== undefined ? img.sortOrder : index,
            },
          })
        )
      );
    }

    const updatedCar = await prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error: any) {
    console.error('Car update error:', error);
    return NextResponse.json({ error: 'Failed to update car: ' + error.message }, { status: 500 });
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
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Car deleted successfully' });
  } catch (error: any) {
    console.error('Car delete error:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
