import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  Sparkles, 
  Car, 
  MessageCircle,
  MapPin,
  BookOpen
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Dream Cars | Premium Cars Showroom in Vehari, Pakistan',
  description: 'Learn about Dream Cars, Pakistan’s premier automobile showroom in Vehari, Punjab. Quality pre-owned, local and Japanese imported cars, 150-point inspection standards, and transparent PKR pricing.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Vehicles Delivered', value: '450+' },
    { label: 'Inspection Checkpoints', value: '150-Point' },
    { label: 'Client Satisfaction Index', value: '99.4%' },
    { label: 'Years in Vehari', value: '12+' },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#0B0B0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            THE DREAM CARS HERITAGE
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2ED] tracking-tight leading-tight">
            Curators of Pure <br />
            <span className="text-[#C8A96B]">Automotive Distinction.</span>
          </h1>
          <p className="text-[#A6A39C] text-sm sm:text-base leading-relaxed">
            Dream Cars was founded on a singular conviction: discerning motorists deserve a showroom experience as refined, reliable, and uncompromising as the vehicles they drive.
          </p>
        </div>

        {/* Brand Story & Large Visual Showcase (Black 2025 Peugeot 2008) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest block flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
              VEHARI, PUNJAB, PAKISTAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F2ED] tracking-tight">
              More than a showroom. A sanctuary for car enthusiasts in Vehari.
            </h2>
            <p className="text-[#A6A39C] text-sm leading-relaxed">
              Located in Vehari, Punjab, Pakistan, Dream Cars stands as the region&apos;s leading destination for quality Pakistani market vehicles, Japanese imports, family crossovers, and luxury automobiles.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed">
              We eliminate the ambiguity of vehicle buying in Pakistan. Every car on our showroom floor undergoes a thorough 150-point diagnostic, biometric record verification, and authentic documentation check with transparent PKR pricing.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="px-6 py-3 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15"
              >
                Browse Our Collection
              </Link>
              <a
                href={getWhatsAppLink('Hello Dream Cars Vehari, I would like to schedule a showroom visit.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 03099491835</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#30302D] bg-[#151514] shadow-2xl">
              <Image
                src="/cars/peugeot-2008-black-2025-side.jpg"
                alt="Black 2025 Peugeot 2008 - Dream Cars Vehari Showroom Showcase"
                fill
                className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold text-[#C8A96B] tracking-wider">
                  FLAGSHIP SHOWCASE • 2025 PEUGEOT 2008
                </span>
                <p className="text-sm font-bold text-[#F4F2ED] mt-0.5">
                  Dream Cars • Vehari, Punjab, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#1D1C19] border border-[#30302D] text-center"
            >
              <span className="text-3xl sm:text-4xl font-black text-[#C8A96B]">
                {s.value}
              </span>
              <p className="text-xs text-[#A6A39C] uppercase tracking-wider font-semibold mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Our Collection & Our Promise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1D1C19] border border-[#30302D] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#F4F2ED]">Pakistan-Focused Fleet</h3>
            <p className="text-[#A6A39C] text-sm leading-relaxed">
              Our curated fleet focuses on vehicles best suited for Pakistani roads and drivers: from top-selling Toyota Corolla and Fortuner to Honda Civic, Suzuki Alto, Kia Sportage, Hyundai Tucson, and modern crossovers like the 2025 Peugeot 2008.
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              We also maintain a dedicated luxury section featuring imported BMW, Mercedes-Benz, Audi, and Land Cruiser models for discerning clients.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#1D1C19] border border-[#30302D] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#F4F2ED]">The Dream Promise</h3>
            <p className="text-[#A6A39C] text-sm leading-relaxed">
              Complete mechanical transparency, authentic excise paperwork, biometric verification, and zero compromises. If a vehicle doesn&apos;t meet our standards, it never enters our Vehari showroom floor.
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              Every car is backed by legal documentation and trade-in rollover facilities for our customers in Vehari and throughout Punjab.
            </p>
          </div>
        </div>

        {/* Explore the Dream Cars Journal */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1D1C19] to-[#151514] border border-[#30302D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F2ED]">
                Explore the Dream Cars Journal
              </h3>
              <p className="text-[#A6A39C] text-sm leading-relaxed mt-2 max-w-xl">
                Discover helpful car buying guides, vehicle reviews, maintenance tips and automotive insights.
              </p>
            </div>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C8A96B]/25 shrink-0"
          >
            <span>Visit Our Blog</span>
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
