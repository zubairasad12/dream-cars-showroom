'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Gauge, 
  MapPin
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#0B0B0A]">
      {/* Background ambient champagne gold light glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#C8A96B]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0B0B0A] to-transparent z-10" />

      {/* Subtle background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A96B 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
              VEHARI, PUNJAB, PAKISTAN
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F2ED] leading-[1.15]">
              Find the Car <br />
              <span className="text-[#A6A39C]">You’ve Been</span>{' '}
              <span className="gold-gradient-text">Dreaming Of.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#A6A39C] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to Dream Cars, Vehari&apos;s premier destination for high-end local, Japanese imported, and certified pre-owned vehicles. Transparent pricing in PKR with verified inspections.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary Button */}
              <Link
                href="/cars"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[#C8A96B]/25 group"
              >
                <span>EXPLORE CARS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary Button */}
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-[#C8A96B] text-[#F4F2ED] hover:text-[#0B0B0A] border border-[#C8A96B] font-semibold text-xs tracking-wider uppercase transition-all"
              >
                <span>CONTACT SHOWROOM</span>
              </Link>

              {/* Direct WhatsApp */}
              <a
                href={getWhatsAppLink('Hello Dream Cars Vehari, I am looking to purchase a vehicle.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#151514] hover:bg-[#1D1C19] text-[#C8A96B] border border-[#30302D] hover:border-[#C8A96B]/50 font-semibold text-xs tracking-wider transition-all"
                title="Direct WhatsApp: 03099491835"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP: 03099491835</span>
              </a>
            </div>

            {/* Quick Showroom Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#30302D] text-left">
              <div>
                <p className="text-2xl font-black text-[#F4F2ED]">100%</p>
                <p className="text-xs text-[#A6A39C] uppercase tracking-wider font-medium mt-0.5">Verified Documents</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#C8A96B]">150+</p>
                <p className="text-xs text-[#A6A39C] uppercase tracking-wider font-medium mt-0.5">Point Inspection</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#F4F2ED]">PKR</p>
                <p className="text-xs text-[#A6A39C] uppercase tracking-wider font-medium mt-0.5">Fair Market Price</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase (2025 Peugeot 2008 in Black) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Image Frame - fully responsive across mobile, tablet, and desktop */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#30302D] bg-[#1D1C19] shadow-2xl shadow-black/80">
                <Image
                  src="/cars/peugeot-2008-black-2025.jpg"
                  alt="2025 Peugeot 2008 Perla Nera Black - Dream Cars Showroom Vehari"
                  fill
                  priority
                  className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-transparent to-transparent opacity-80" />

                {/* In-image Car Label */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between">
                  <div className="bg-[#1D1C19]/90 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-[#30302D]">
                    <span className="text-[9px] sm:text-[10px] text-[#C8A96B] uppercase tracking-widest font-bold block">
                      FEATURED SHOWCASE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#F4F2ED]">
                      2025 Peugeot 2008 (Nera Black)
                    </span>
                  </div>

                  <Link
                    href="/cars"
                    className="p-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] transition-colors shadow-lg"
                    aria-label="View Car"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="absolute -top-4 -left-3 sm:-left-6 bg-[#1D1C19]/95 border border-[#30302D] backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#151514] text-[#C8A96B] border border-[#30302D] flex items-center justify-center shrink-0">
                  <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A6A39C] tracking-wider">1.2L PureTech</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#F4F2ED]">130 HP Turbo</div>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-[#1D1C19]/95 border border-[#30302D] backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#151514] text-[#C8A96B] border border-[#30302D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#C8A96B] tracking-wider">Dream Certified</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#F4F2ED]">Vehari Showroom</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
