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
    <section className="py-20 bg-[#151514] border-t border-b border-[#30302D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest block mb-1">
              WORLD-CLASS ENGINEERING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F2ED] tracking-tight">
              Prestige Automotive <span className="text-[#C8A96B] font-light">Marques</span>
            </h2>
          </div>

          <Link
            href="/brands"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#C8A96B] hover:text-[#D8C08A] uppercase tracking-wider transition-colors"
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
              className="group relative p-6 rounded-2xl bg-[#1D1C19] border border-[#30302D] hover:border-[#C8A96B] hover:bg-[#242320] transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 shadow-md hover:shadow-black/50"
            >
              {/* Brand Name */}
              <h3 className="text-base font-extrabold text-[#F4F2ED] group-hover:text-[#D8C08A] transition-colors tracking-wide">
                {brand.name}
              </h3>

              {/* Cars count */}
              <span className="text-[11px] text-[#A6A39C] group-hover:text-[#F4F2ED] transition-colors mt-1 font-medium">
                {brand._count?.cars ? `${brand._count.cars} Vehicles Available` : 'Available in Gallery'}
              </span>

              {/* Hover indicator */}
              <div className="mt-3 flex items-center gap-1 text-[10px] text-[#C8A96B] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
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
