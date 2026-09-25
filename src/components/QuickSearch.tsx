'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { Brand } from '@/lib/types';

export default function QuickSearch() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [model, setModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('all');
  const [transmission, setTransmission] = useState('all');

  useEffect(() => {
    fetch('/api/brands?activeOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error('Error fetching brands:', err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (model.trim()) params.set('model', model.trim());
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (year) params.set('year', year);
    if (fuelType && fuelType !== 'all') params.set('fuelType', fuelType);
    if (transmission && transmission !== 'all') params.set('transmission', transmission);

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
      <div className="bg-[#151514] border border-[#30302D] rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/80">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#30302D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1D1C19] border border-[#30302D] text-[#C8A96B]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F2ED] tracking-wide">
                Quick Vehicle Search
              </h3>
              <p className="text-xs text-[#A6A39C]">
                Filter our showroom inventory by exact specifications
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#C8A96B] uppercase tracking-widest self-start sm:self-center">
            Dream Cars Filter Matrix
          </span>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. Corolla, Civic, Alto, Sportage"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs placeholder:text-[#A6A39C]/50 focus:outline-none focus:border-[#C8A96B] transition-colors"
            />
          </div>

          {/* Min Price */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Min Price (PKR)
            </label>
            <input
              type="number"
              placeholder="Min PKR"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs placeholder:text-[#A6A39C]/50 focus:outline-none focus:border-[#C8A96B] transition-colors"
            />
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Max Price (PKR)
            </label>
            <input
              type="number"
              placeholder="Max PKR"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs placeholder:text-[#A6A39C]/50 focus:outline-none focus:border-[#C8A96B] transition-colors"
            />
          </div>

          {/* Year */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Model Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
            >
              <option value="">Any Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Fuel Type
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
            >
              <option value="all">All Fuels</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A6A39C]">
              Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
            >
              <option value="all">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Dual-Clutch">Dual-Clutch / PDK</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg hover:shadow-[#C8A96B]/20"
            >
              <span>SEARCH CARS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
