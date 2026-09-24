import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ArrowRight, Sparkles, Car } from 'lucide-react';

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
    <div className="pt-28 pb-24 bg-[#08090C] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LEGENDARY MARQUES
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Curated Luxury <span className="text-rose-500">Brands</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Representing the finest automotive manufacturers across Germany, the United Kingdom, Italy, and Japan. Select a marque to view available inventory.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group bg-[#111319] border border-white/10 hover:border-rose-500/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#171A24] border border-white/10 flex items-center justify-center p-2.5">
                    <Car className="w-8 h-8 text-rose-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-600/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                    {brand._count.cars} {brand._count.cars === 1 ? 'Car' : 'Cars'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-rose-400 transition-colors">
                  {brand.name}
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                  {brand.description || 'Prestige automotive engineering and luxury motoring heritage.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-white group-hover:text-rose-400 uppercase tracking-wider">
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
