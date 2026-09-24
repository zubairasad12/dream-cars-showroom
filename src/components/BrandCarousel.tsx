'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from '@/lib/types';

export default function BrandCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch('/api/brands?activeOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error('Error fetching brands:', err));
  }, []);

  return (
    <section className="py-20 bg-[#060709] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">
              WORLD-CLASS ENGINEERING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prestige Automotive <span className="text-slate-400 font-light">Marques</span>
            </h2>
          </div>

          <Link
            href="/brands"
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>All Showroom Brands</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative p-6 rounded-2xl bg-[#0D0F14] border border-white/5 hover:border-rose-500/40 hover:bg-[#131620] transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
            >
              {/* Brand Name */}
              <h3 className="text-base font-extrabold text-white group-hover:text-rose-400 transition-colors tracking-wide">
                {brand.name}
              </h3>

              {/* Cars count */}
              <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors mt-1 font-medium">
                {brand._count?.cars ? `${brand._count.cars} Vehicles Available` : 'Available in Gallery'}
              </span>

              {/* Hover indicator */}
              <div className="mt-3 flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Models</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
