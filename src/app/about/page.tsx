import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Car, 
  Users, 
  Clock, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Dream Cars | Curators of Automotive Distinction',
  description: 'Learn about Dream Cars, Pakistan’s leading luxury and exotic automobile showroom. Our heritage, philosophy, mechanical inspection standards, and white-glove concierge service.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Exotic Vehicles Delivered', value: '450+' },
    { label: 'Inspection Checkpoints', value: '150-Point' },
    { label: 'Client Satisfaction Index', value: '99.4%' },
    { label: 'Years of Automotive Heritage', value: '12+' },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#08090C] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-rose-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            THE DREAM CARS HERITAGE
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Curators of Pure <br />
            <span className="text-rose-500">Automotive Distinction.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Dream Cars was founded on a singular conviction: discerning motorists deserve a showroom experience as refined, exhilarating, and uncompromising as the machines they collect.
          </p>
        </div>

        {/* Brand Story & Large Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">
              WHO WE ARE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              More than a showroom. A sanctuary for automotive passion.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Headquartered in Lahore&apos;s prestigious Gulberg district, Dream Cars stands as Pakistan&apos;s premier destination for genuine luxury, exotic, and track-engineered motorcars.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We eliminate the ambiguity of high-end vehicle acquisitions. Every car on our climate-controlled gallery floor undergoes our non-negotiable 150-point certified diagnostic, title authenticity check, and provenance verification.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Browse Our Collection
              </Link>
              <a
                href={getWhatsAppLink('Hello Dream Cars, I would like to schedule a private showroom consultation.')}
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
            <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Dream Cars Luxury Showroom Interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  CLIMATE CONTROLLED PAVILION
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  Main Boulevard, Gulberg III, Lahore, Pakistan
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
              className="p-8 rounded-3xl bg-[#111319] border border-white/10 text-center"
            >
              <span className="text-3xl sm:text-4xl font-black text-rose-500">
                {s.value}
              </span>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Our Collection & Our Promise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#111319] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Collection</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our curated fleet focuses on automotive icons: from the precision of Porsche 911s and the sheer muscle of Mercedes-AMG GTs, to the sovereign luxury of Range Rover SV and the bulletproof capability of the Land Cruiser 300 GR Sport.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              We also feature enthusiast masterpieces, including iconic championship Type R models, celebrating motorsport heritage.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#111319] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Promise</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Total mechanical transparency, authentic paperwork, and zero compromises. If a vehicle does not meet our rigorous 150-point benchmark, it will never enter our showroom.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              We stand behind every automobile with complete legal indemnification and optional post-delivery concierge maintenance plans.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
