import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import CarCard from '@/components/CarCard';
import { ChevronRight, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
  });

  if (!brand) return { title: 'Brand Not Found | Dream Cars' };

  return {
    title: `${brand.name} Luxury Cars for Sale | Dream Cars Showroom`,
    description: `Browse our curated collection of ${brand.name} automobiles. Verified inspections, certified luxury, and immediate showroom delivery.`,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
    include: {
      cars: {
        include: {
          brand: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
        orderBy: { year: 'desc' },
      },
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24 bg-[#0B0B0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A6A39C] mb-6">
          <Link href="/" className="hover:text-[#F4F2ED] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/brands" className="hover:text-[#F4F2ED] transition-colors">Brands</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F4F2ED] font-semibold">{brand.name}</span>
        </nav>

        {/* Brand Banner */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A96B]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              OFFICIAL SHOWROOM MARQUE
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
              {brand.name} <span className="text-[#C8A96B]">Collection</span>
            </h1>

            <p className="text-[#A6A39C] text-sm sm:text-base leading-relaxed">
              {brand.description || `Explore our exclusive selection of ${brand.name} vehicles, inspected to the highest automotive standards.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <span className="text-xs text-[#A6A39C]">
                <strong className="text-[#F4F2ED]">{brand.cars.length}</strong> {brand.cars.length === 1 ? 'vehicle' : 'vehicles'} currently in showroom
              </span>

              <a
                href={getWhatsAppLink(`Hello Dream Cars, I am interested in acquiring a ${brand.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp (03099491835)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Brand Vehicles List */}
        {brand.cars.length === 0 ? (
          <div className="text-center py-16 bg-[#1D1C19] rounded-3xl border border-[#30302D] p-8 space-y-4">
            <p className="text-lg text-[#F4F2ED] font-bold">Currently No {brand.name} in Stock</p>
            <p className="text-xs text-[#A6A39C] max-w-sm mx-auto">
              Our acquisitions team regularly sources bespoke {brand.name} models. Contact us to request custom vehicle procurement.
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Showroom Cars</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brand.cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
