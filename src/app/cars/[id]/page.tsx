import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import CarGallery from '@/components/CarGallery';
import CarDetailInquiryForm from './CarDetailInquiryForm';
import { 
  Gauge, 
  Fuel, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  PhoneCall, 
  Share2, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { formatPrice, formatMileage, SHOWROOM_PHONE, getCarWhatsAppLink } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { brand: true, images: { take: 1 } },
  });

  if (!car) {
    return { title: 'Vehicle Not Found | Dream Cars' };
  }

  const brandName = car.brand?.name || 'Luxury';
  const title = `${car.year} ${brandName} ${car.model} for Sale | Dream Cars Showroom`;
  const description = `${car.year} ${brandName} ${car.model} in ${car.exteriorColor}. ${car.horsepower} HP, ${car.engine}, ${car.transmission}. Certified luxury vehicle at Dream Cars.`;
  const primaryImage = car.images[0]?.imageUrl || '/logo.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: primaryImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      brand: true,
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
      },
    },
  });

  if (!car) {
    notFound();
  }

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(car.features);
  } catch (e) {
    featuresList = car.features ? car.features.split(',').map((f) => f.trim()) : [];
  }

  const brandName = car.brand?.name || 'Exclusive';
  const whatsappCarLink = getCarWhatsAppLink(car);

  const specs = [
    { label: 'Model Year', value: car.year },
    { label: 'Condition', value: car.condition },
    { label: 'Odometer Mileage', value: formatMileage(car.mileage) },
    { label: 'Engine', value: car.engine },
    { label: 'Power Output', value: `${car.horsepower} Horsepower` },
    { label: 'Transmission', value: car.transmission },
    { label: 'Drivetrain', value: car.driveType },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Body Style', value: car.bodyType },
    { label: 'Exterior Color', value: car.exteriorColor },
    { label: 'Interior Upholstery', value: car.interiorColor },
    { label: 'Showroom Status', value: car.status },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#08090C] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cars" className="hover:text-white transition-colors">Inventory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/brands/${car.brand?.slug}`} className="hover:text-white transition-colors">{brandName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-semibold truncate">{car.model}</span>
        </nav>

        {/* Top Title & Price Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-600/10 text-rose-400 border border-rose-500/25 text-xs font-bold uppercase tracking-wider">
                {brandName}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-semibold">
                {car.year}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-semibold">
                {car.status}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {brandName} {car.model}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Stock ID: #{car.id.slice(-6).toUpperCase()} • Verified Showroom Authenticity
            </p>
          </div>

          <div className="flex flex-col lg:items-end">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Showroom Asking Price
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
              {formatPrice(car.price)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Includes customs documentation & title transfer
            </span>
          </div>
        </div>

        {/* Gallery & Quick Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          {/* Main Gallery Column */}
          <div className="lg:col-span-8">
            <CarGallery images={car.images} title={`${car.year} ${brandName} ${car.model}`} />
          </div>

          {/* Quick Concierge CTA Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111319] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/10 rounded-full blur-[60px] pointer-events-none" />

              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">
                  DIRECT CONCIERGE
                </span>
                <h3 className="text-xl font-bold text-white">
                  Interested in this vehicle?
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Contact our private showroom concierge immediately to confirm physical availability or schedule a viewing.
                </p>
              </div>

              {/* Direct WhatsApp Callout */}
              <a
                href={whatsappCarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-950/60"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
                <span>INQUIRE ON WHATSAPP (03099491835)</span>
              </a>

              {/* Call Showroom */}
              <a
                href={`tel:${SHOWROOM_PHONE}`}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
              >
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <span>CALL SHOWROOM: {SHOWROOM_PHONE}</span>
              </a>

              {/* Quick Perks */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>150-Point Certified Mechanical Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clean Title & Duty-Paid Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Trade-In Valuations Accepted</span>
                </div>
              </div>

            </div>

            {/* Quick Specs Highlight Card */}
            <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-[#161922]">
                <Zap className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Power</span>
                <span className="text-sm font-bold text-white">{car.horsepower} HP</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#161922]">
                <Gauge className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mileage</span>
                <span className="text-sm font-bold text-white">{formatMileage(car.mileage)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#161922]">
                <Fuel className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fuel</span>
                <span className="text-sm font-bold text-white">{car.fuelType}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#161922]">
                <Calendar className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Drivetrain</span>
                <span className="text-sm font-bold text-white">{car.driveType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Technical Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Description & Features */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Vehicle Narrative */}
            <div className="bg-[#111319] border border-white/10 rounded-3xl p-8 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-rose-500" />
                Vehicle Overview
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="bg-[#111319] border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#161922] border border-white/5 text-xs">
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features & Options Checklist */}
            {featuresList.length > 0 && (
              <div className="bg-[#111319] border border-white/10 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white">
                  Luxury Options & Factory Packages
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuresList.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#161922]/70 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Direct Contact & Inquiry Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <CarDetailInquiryForm car={car} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
