import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'default-settings' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'default-settings',
          showroomName: 'Dream Cars',
          logo: '/logo.png',
          phone: '03099491835',
          whatsapp: '923099491835',
          email: 'contact@dreamcars.com',
          address: 'Dream Cars Showroom, Khanewal Road, Front of Stadium Gate, Vehari, Punjab, Pakistan',
          openingHours: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: By Exclusive Appointment',
          socialLinks: JSON.stringify({
            facebook: 'https://facebook.com/dreamcars',
            instagram: 'https://instagram.com/dreamcars',
            twitter: 'https://twitter.com/dreamcars',
            youtube: 'https://youtube.com/@dreamcars',
          }),
          aboutText: 'Dream Cars is the preeminent destination for connoisseurs of automotive distinction. Representing the pinnacle of German precision, British refinement, and Japanese perfection.',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      showroomName,
      logo,
      phone,
      whatsapp,
      email,
      address,
      openingHours,
      socialLinks,
      aboutText,
    } = body;

    const settings = await prisma.settings.upsert({
      where: { id: 'default-settings' },
      update: {
        showroomName,
        logo,
        phone,
        whatsapp,
        email,
        address,
        openingHours,
        socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks,
        aboutText,
      },
      create: {
        id: 'default-settings',
        showroomName: showroomName || 'Dream Cars',
        logo: logo || '/logo.png',
        phone: phone || '03099491835',
        whatsapp: whatsapp || '923099491835',
        email: email || 'contact@dreamcars.com',
        address: address || 'Dream Cars Showroom, Khanewal Road, Front of Stadium Gate, Vehari, Punjab, Pakistan',
        openingHours: openingHours || 'Mon - Sat: 10:00 AM - 9:00 PM',
        socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : (socialLinks || '{}'),
        aboutText: aboutText || '',
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
