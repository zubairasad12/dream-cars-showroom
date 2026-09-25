import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ArrowRight, Sparkles, Car } from 'lucide-react';

// Brand list changes with inventory — always render fresh
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luxury Automotive Brands & Marques | Dream Cars Showroom',
  description: 'Explore the world’s most prestigious automotive marques at Dream Cars. From Porsche and Mercedes-AMG to BMW M, Audi RS, and Range Rover.',
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { cars: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="pt-28 pb-24 bg-[#0B0B0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LEGENDARY MARQUES
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
            Curated Luxury <span className="text-[#C8A96B]">Brands</span>
          </h1>
          <p className="text-[#A6A39C] text-sm sm:text-base mt-3 leading-relaxed">
            Representing the finest automotive manufacturers across Germany, the United Kingdom, Italy, and Japan. Select a marque to view available inventory.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group bg-[#1D1C19] border border-[#30302D] hover:border-[#C8A96B]/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#151514] border border-[#30302D] flex items-center justify-center p-2.5">
                    <Car className="w-8 h-8 text-[#C8A96B]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/20 text-xs font-semibold">
                    {brand._count.cars} {brand._count.cars === 1 ? 'Car' : 'Cars'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#F4F2ED] group-hover:text-[#C8A96B] transition-colors">
                  {brand.name}
                </h3>

                <p className="text-[#A6A39C] text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                  {brand.description || 'Prestige automotive engineering and luxury motoring heritage.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#30302D] flex items-center justify-between text-xs font-bold text-[#F4F2ED] group-hover:text-[#C8A96B] uppercase tracking-wider transition-colors">
                <span>View {brand.name} Inventory</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
