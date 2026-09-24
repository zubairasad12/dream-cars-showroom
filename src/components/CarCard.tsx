'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Fuel, 
  Gauge, 
  Zap, 
  ArrowRight, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Car } from '@/lib/types';
import { formatPrice, formatMileage, getCarWhatsAppLink } from '@/lib/utils';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80';

  const brandName = car.brand?.name || 'Luxury';

  const isSold = car.status === 'Sold';
  const isReserved = car.status === 'Reserved';

  return (
    <div className="group rounded-2xl bg-[#111319] border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/80 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
          <Image
            src={primaryImage}
            alt={`${car.year} ${brandName} ${car.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-black/40 opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {car.featured && (
                <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-black/60 text-slate-200 border border-white/15 text-[10px] font-semibold tracking-wider backdrop-blur-md">
                {car.year}
              </span>
            </div>

            {/* Status Badge */}
            <div>
              {isSold ? (
                <span className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Sold
                </span>
              ) : isReserved ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Reserved
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium tracking-wide backdrop-blur-md">
                  Available
                </span>
              )}
            </div>
          </div>

          {/* Bottom subtle specs overlay */}
          <div className="absolute bottom-3 left-3 text-xs font-semibold text-white/90 drop-shadow">
            {car.horsepower} HP • {car.bodyType}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Brand & Model */}
          <div className="mb-3">
            <p className="text-xs font-bold text-rose-500 tracking-widest uppercase">
              {brandName}
            </p>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 mt-0.5">
              {car.model}
            </h3>
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{car.transmission.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{car.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTAs */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Price
            </span>
            <span className="text-xl font-extrabold text-white">
              {formatPrice(car.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp button for this specific car */}
            <a
              href={getCarWhatsAppLink(car)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              title="Chat about this car on WhatsApp (03099491835)"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* View Details Link */}
            <Link
              href={`/cars/${car.id}`}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white text-xs font-semibold tracking-wider transition-all hover:shadow-lg hover:shadow-rose-900/40"
            >
              <span>DETAILS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
