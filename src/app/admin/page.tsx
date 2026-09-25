import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';
import { 
  Car, 
  Sparkles, 
  Tag, 
  Inbox, 
  CheckCircle, 
  PlusCircle, 
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    redirect('/admin/login');
  }

  const [
    totalCars,
    featuredCars,
    soldCars,
    totalBrands,
    newInquiries,
    recentInquiries,
    recentCars
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { featured: true } }),
    prisma.car.count({ where: { status: 'Sold' } }),
    prisma.brand.count(),
    prisma.inquiry.count({ where: { status: 'New' } }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        car: {
          select: {
            id: true,
            model: true,
            year: true,
            brand: { select: { name: true } },
          },
        },
      },
    }),
    prisma.car.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        brand: true,
        images: {
          take: 1,
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    }),
  ]);

  const cards = [
    { label: 'Total Showroom Cars', value: totalCars, icon: Car, color: 'text-[#F4F2ED]', bg: 'bg-white/5' },
    { label: 'Featured Vehicles', value: featuredCars, icon: Sparkles, color: 'text-[#C8A96B]', bg: 'bg-[#C8A96B]/10' },
    { label: 'Sold Cars', value: soldCars, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Brands', value: totalBrands, icon: Tag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'New Client Inquiries', value: newInquiries, icon: Inbox, color: 'text-[#C8A96B]', bg: 'bg-[#C8A96B]/10' },
  ];

  return (
    <div className="space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30302D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight">
            Showroom Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A39C] mt-1">
            Welcome back, <span className="text-[#F4F2ED] font-semibold">{admin.name}</span>. Here is your inventory performance and incoming client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#1D1C19] border border-[#30302D] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider">
                  {c.label}
                </span>
                <div className={`p-2 rounded-xl ${c.bg}`}>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
              <p className={`text-3xl font-extrabold ${c.color}`}>
                {c.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Inquiries */}
        <div className="lg:col-span-6 bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#30302D]">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#C8A96B]" />
              <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider">
                Recent Inquiries & Leads
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs text-[#C8A96B] hover:text-[#D8C08A] transition-colors font-semibold"
            >
              View All Inquiries →
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-[#A6A39C] py-6 text-center">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-[#151514] border border-[#30302D] space-y-2 hover:border-[#C8A96B]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F4F2ED]">{inq.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === 'New'
                          ? 'bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30'
                          : inq.status === 'Contacted'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#A6A39C] line-clamp-1 font-medium">
                    {inq.subject}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A6A39C] pt-1 border-t border-[#30302D]">
                    <span>{inq.phone} • {inq.email}</span>
                    {inq.car && (
                      <span className="text-[#C8A96B] font-semibold truncate">
                        Car: {inq.car.brand.name} {inq.car.model}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Vehicles */}
        <div className="lg:col-span-6 bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#30302D]">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#C8A96B]" />
              <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider">
                Recent Showroom Vehicles
              </h2>
            </div>
            <Link
              href="/admin/cars"
              className="text-xs text-[#C8A96B] hover:text-[#D8C08A] transition-colors font-semibold"
            >
              Manage All Cars →
            </Link>
          </div>

          <div className="space-y-3">
            {recentCars.map((c) => {
              const imgUrl = c.images[0]?.imageUrl || '/logo.png';
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151514] border border-[#30302D] hover:border-[#C8A96B]/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                      <Image
                        src={imgUrl}
                        alt={c.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#C8A96B] uppercase tracking-wider truncate">
                        {c.brand?.name}
                      </p>
                      <h4 className="text-sm font-bold text-[#F4F2ED] truncate">
                        {c.model} ({c.year})
                      </h4>
                      <span className="text-xs text-[#C8A96B] font-medium">
                        {formatPrice(c.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        c.status === 'Sold'
                          ? 'bg-red-950/80 text-red-400'
                          : c.status === 'Reserved'
                          ? 'bg-amber-950/80 text-amber-300'
                          : 'bg-emerald-950/80 text-emerald-400'
                      }`}
                    >
                      {c.status}
                    </span>

                    <Link
                      href={`/admin/cars/${c.id}/edit`}
                      className="px-3 py-1.5 rounded-lg bg-[#30302D] hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] text-[11px] font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
