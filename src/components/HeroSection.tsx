'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Gauge, 
  Flame, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#08090C]">
      {/* Background ambient automotive light glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#08090C] to-transparent z-10" />

      {/* Subtle grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-slate-300 uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              PREMIUM AUTOMOTIVE COLLECTION
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Find the Car <br />
              <span className="luxury-gradient-text">You’ve Been</span>{' '}
              <span className="text-rose-500">Dreaming Of.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore our carefully selected collection of premium vehicles, designed for those who expect more from every drive. Certified pedigrees, unmatched luxury, and white-glove service.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/cars"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm tracking-wider uppercase transition-all shadow-xl shadow-rose-950/50 hover:shadow-rose-600/30 group"
              >
                <span>EXPLORE CARS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 font-semibold text-sm tracking-wider uppercase transition-colors"
              >
                <span>CONTACT SHOWROOM</span>
              </Link>

              {/* Direct WhatsApp Callout */}
              <a
                href={getWhatsAppLink('Hello Dream Cars Showroom, I am looking to purchase a luxury vehicle.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs tracking-wider transition-all"
                title="Direct WhatsApp: 03099491835"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP: 03099491835</span>
              </a>
            </div>

            {/* Quick Showroom Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Verified Provenance</p>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-500">150+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Point Inspection</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Concierge Support</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Image Frame with glowing backdrop */}
              <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-slate-900 via-[#111319] to-black shadow-2xl shadow-black">
                <Image
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85"
                  alt="Dream Cars Luxury Automotive Showcase"
                  fill
                  priority
                  className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-70" />

                {/* In-image Car Label */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
                    <span className="text-[10px] text-rose-400 uppercase tracking-widest font-bold block">
                      FLAGSHIP SHOWCASE
                    </span>
                    <span className="text-sm font-bold text-white">
                      Mercedes-AMG GT Black Series
                    </span>
                  </div>

                  <Link
                    href="/cars"
                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg"
                    aria-label="View Car"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Floating Stat Badge 1: Top Speed / 0-60 */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-[#111319]/90 border border-white/15 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">0 - 100 KM/H</div>
                  <div className="text-base font-extrabold text-white">3.1 Seconds</div>
                </div>
              </div>

              {/* Floating Stat Badge 2: Certified Warranty */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-[#111319]/90 border border-emerald-500/30 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Dream Certified</div>
                  <div className="text-base font-extrabold text-white">Verified Excellence</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
