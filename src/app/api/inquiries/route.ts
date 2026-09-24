import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (type && type !== 'all') {
      where.inquiryType = type;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            model: true,
            year: true,
            price: true,
            brand: { select: { name: true } },
            images: { take: 1, select: { imageUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error('Inquiries GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, carId, subject, message, inquiryType, tradeInDetails } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone number, and email are required' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        phone,
        email,
        carId: carId || null,
        subject: subject || (inquiryType === 'Trade-In' ? 'Vehicle Trade-in Request' : 'Showroom Inquiry'),
        message: message || '',
        inquiryType: inquiryType || 'General',
        tradeInDetails: tradeInDetails ? (typeof tradeInDetails === 'string' ? tradeInDetails : JSON.stringify(tradeInDetails)) : null,
        status: 'New',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. Our luxury automotive concierge will reach out to you shortly.',
        inquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Inquiry POST error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
