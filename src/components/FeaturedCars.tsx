'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import CarCard from './CarCard';
import { Car } from '@/lib/types';

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    async function loadFeaturedCars() {
      try {
        setLoading(true);
        const res = await fetch('/api/cars?featured=true&limit=6');
        const data = await res.json();
        if (data.cars) {
          setCars(data.cars);
        }
      } catch (err) {
        console.error('Error loading featured cars:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedCars();
  }, []);

  const filteredCars = filterType === 'all' 
    ? cars 
    : cars.filter((c) => c.bodyType.toLowerCase() === filterType.toLowerCase());

  return (
    <section className="py-24 bg-[#0B0B0A] relative">
      {/* Background subtle gold glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-[#C8A96B]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151514] text-[#C8A96B] border border-[#30302D] text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
              HANDPICKED EXCELLENCE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
              Featured <span className="text-[#C8A96B]">Collection</span>
            </h2>
            <p className="text-[#A6A39C] text-sm sm:text-base max-w-xl mt-2">
              Select vehicles chosen for their extraordinary pedigree, performance milestones, and pristine physical presentation.
            </p>
          </div>

          {/* Body Type Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            {['all', 'Sedan', 'Coupe', 'SUV', 'Sports'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filterType.toLowerCase() === type.toLowerCase()
                    ? 'bg-[#C8A96B] text-[#0B0B0A] shadow-md shadow-[#C8A96B]/20'
                    : 'bg-[#1D1C19] text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#242320] border border-[#30302D]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#1D1C19] animate-pulse border border-[#30302D]" />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-[#1D1C19] rounded-3xl border border-[#30302D] p-8">
            <AlertCircle className="w-10 h-10 text-[#A6A39C] mx-auto mb-3" />
            <p className="text-base text-[#F4F2ED] font-medium">No featured cars found for this category</p>
            <p className="text-xs text-[#A6A39C] mt-1">Explore our complete showroom inventory to see all available models.</p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Explore All Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Bottom CTA to explore all inventory */}
        <div className="mt-14 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent hover:bg-[#C8A96B] text-[#F4F2ED] hover:text-[#0B0B0A] border border-[#C8A96B] text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <span>VIEW COMPLETE SHOWROOM INVENTORY</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
