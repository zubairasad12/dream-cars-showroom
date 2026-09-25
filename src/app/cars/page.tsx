'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Filter
} from 'lucide-react';
import CarCard from '@/components/CarCard';
import { Car, Brand } from '@/lib/types';

function CarsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State initialized from searchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || 'all');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'all');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || 'all');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Fetch active brands
  useEffect(() => {
    fetch('/api/brands?activeOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch cars when filters or page changes
  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (year) params.set('year', year);
        if (fuelType && fuelType !== 'all') params.set('fuelType', fuelType);
        if (transmission && transmission !== 'all') params.set('transmission', transmission);
        if (bodyType && bodyType !== 'all') params.set('bodyType', bodyType);
        if (condition && condition !== 'all') params.set('condition', condition);
        if (sort) params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '9');

        const res = await fetch(`/api/cars?${params.toString()}`);
        const data = await res.json();
        if (data.cars) {
          setCars(data.cars);
          setTotal(data.total);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, [search, selectedBrand, minPrice, maxPrice, year, fuelType, transmission, bodyType, condition, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setYear('');
    setFuelType('all');
    setTransmission('all');
    setBodyType('all');
    setCondition('all');
    setSort('newest');
    setPage(1);
    router.push('/cars');
  };

  const hasActiveFilters = 
    search || selectedBrand !== 'all' || minPrice || maxPrice || year || fuelType !== 'all' || transmission !== 'all' || bodyType !== 'all' || condition !== 'all';

  return (
    <div className="pt-28 pb-20 bg-[#0B0B0A] min-h-screen text-[#F4F2ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            SHOWROOM INVENTORY
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
            Explore Our <span className="text-[#C8A96B]">Luxury Cars</span>
          </h1>
          <p className="text-[#A6A39C] text-sm sm:text-base mt-2 max-w-2xl">
            Browse our verified fleet of high-performance grand tourers, executive saloons, bespoke supercars, and commanding luxury SUVs.
          </p>
        </div>

        {/* Top Control Bar: Search + Filter Toggle + Sorting */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#151514] p-4 rounded-2xl border border-[#30302D] shadow-lg">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#A6A39C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, specs, color..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder:text-[#A6A39C]/50 focus:outline-none focus:border-[#C8A96B] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A39C] hover:text-[#F4F2ED]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1C19] hover:bg-[#242320] text-[#F4F2ED] border border-[#30302D] text-xs font-semibold"
            >
              <Filter className="w-4 h-4 text-[#C8A96B]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A6A39C] hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="newest">Newest Listed</option>
                <option value="oldest">Oldest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mileage-asc">Lowest Mileage</option>
                <option value="year-desc">Newest Model Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Cars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-[#151514] p-6 rounded-3xl border border-[#30302D] h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#30302D]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C8A96B]" />
                <h3 className="text-sm font-bold text-[#F4F2ED] uppercase tracking-wider">
                  Filters
                </h3>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] text-[#C8A96B] hover:text-[#D8C08A] font-semibold uppercase tracking-wider"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Marque / Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="all">All Body Types</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Crossover">Crossover</option>
                <option value="Pickup">Pickup</option>
                <option value="Coupe">Coupe</option>
                <option value="Sports">Sports Car</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Price Range (PKR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B] placeholder:text-[#A6A39C]/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B] placeholder:text-[#A6A39C]/40"
                />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Model Year
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="">Any Year</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="all">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => {
                  setTransmission(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="all">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
                <option value="Manual">Manual</option>
                <option value="Dual-Clutch">Dual-Clutch (DCT)</option>
                <option value="AGS">AGS (Auto Gear Shift)</option>
              </select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="all">All Conditions</option>
                <option value="Brand New">Brand New (0 Meter)</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                <option value="Used">Used</option>
                <option value="Japanese Imported">Japanese Imported</option>
              </select>
            </div>

          </aside>

          {/* Cars Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Count & Active Tags */}
            <div className="flex items-center justify-between text-xs text-[#A6A39C]">
              <span>Showing <strong className="text-[#F4F2ED]">{cars.length}</strong> of <strong className="text-[#F4F2ED]">{total}</strong> vehicles</span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#C8A96B] hover:underline"
                >
                  Clear all active filters
                </button>
              )}
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-[#1D1C19] animate-pulse border border-[#30302D]" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-[#1D1C19] rounded-3xl p-12 text-center border border-[#30302D] space-y-4">
                <p className="text-lg font-bold text-[#F4F2ED]">No vehicles found matching your criteria</p>
                <p className="text-xs text-[#A6A39C] max-w-sm mx-auto">
                  Try adjusting your filters or price range, or contact our showroom concierge for custom sourcing.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#30302D]">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2.5 rounded-xl bg-[#1D1C19] hover:bg-[#242320] disabled:opacity-30 disabled:pointer-events-none text-[#F4F2ED] border border-[#30302D] transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        p === page
                          ? 'bg-[#C8A96B] text-[#0B0B0A] shadow-md shadow-[#C8A96B]/20'
                          : 'bg-[#1D1C19] text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#242320] border border-[#30302D]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2.5 rounded-xl bg-[#1D1C19] hover:bg-[#242320] disabled:opacity-30 disabled:pointer-events-none text-[#F4F2ED] border border-[#30302D] transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-sm bg-[#0B0B0A] h-full p-6 overflow-y-auto space-y-6 border-l border-[#30302D] animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#30302D]">
              <h3 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider">
                Filter Vehicles
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-[#A6A39C] hover:text-[#F4F2ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="text-xs font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs"
              >
                <option value="all">All</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Crossover">Crossover</option>
                <option value="Pickup">Pickup</option>
                <option value="Coupe">Coupe</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-3 rounded-xl bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] text-xs font-bold uppercase"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-[#C8A96B] text-[#0B0B0A] text-xs font-bold uppercase"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0A] pt-32 text-center text-[#A6A39C]">Loading showroom inventory...</div>}>
      <CarsContent />
    </Suspense>
  );
}
