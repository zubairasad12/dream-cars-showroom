'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Car } from '@/lib/types';
import { formatPrice, formatMileage } from '@/lib/utils';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '50');

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (data.cars) setCars(data.cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search, statusFilter]);

  const handleDelete = async (id: string, model: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${model}" from the showroom?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vehicle');
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting car');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30302D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight">
            Vehicle Management
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A39C] mt-1">
            Maintain, edit, upload photos, and update showroom inventory status.
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1D1C19] p-4 rounded-2xl border border-[#30302D]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand, model, color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#A6A39C] whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
          >
            <option value="all">All Vehicles</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#A6A39C]">
            Loading vehicle inventory...
          </div>
        ) : cars.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-stone-500 mx-auto" />
            <p className="text-sm font-semibold text-[#F4F2ED]">No vehicles found</p>
            <p className="text-xs text-[#A6A39C]">Try changing your search or add a new vehicle.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151514] text-[#A6A39C] font-bold uppercase tracking-wider border-b border-[#30302D]">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Year & Price</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30302D] text-[#A6A39C]">
                {cars.map((car) => {
                  const imgUrl = car.images[0]?.imageUrl || '/logo.png';
                  return (
                    <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Vehicle Image & Model */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative border border-[#30302D]">
                            <Image
                              src={imgUrl}
                              alt={car.model}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#C8A96B] uppercase tracking-widest block">
                              {car.brand?.name}
                            </span>
                            <span className="font-bold text-[#F4F2ED] text-sm">
                              {car.model}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Year & Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-[#C8A96B] block">
                          {formatPrice(car.price)}
                        </span>
                        <span className="text-[11px] text-[#A6A39C]">
                          {car.year} Model
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4">
                        <span className="block text-[#F4F2ED] font-medium">
                          {car.horsepower} HP • {car.bodyType}
                        </span>
                        <span className="text-[11px] text-[#A6A39C]">
                          {formatMileage(car.mileage)} • {car.transmission.split(' ')[0]}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4">
                        {car.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30 text-[10px] font-bold uppercase">
                            <Sparkles className="w-3 h-3" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-stone-500 text-[11px]">No</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            car.status === 'Sold'
                              ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                              : car.status === 'Reserved'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {car.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/cars/${car.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-[#151514] hover:bg-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] transition-colors"
                            title="View on Public Site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/cars/${car.id}/edit`}
                            className="p-1.5 rounded-lg bg-[#151514] hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#A6A39C] transition-colors"
                            title="Edit Vehicle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            disabled={deletingId === car.id}
                            onClick={() => handleDelete(car.id, car.model)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white transition-colors disabled:opacity-50"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
