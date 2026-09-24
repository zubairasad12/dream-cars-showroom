import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Award, 
  ArrowRight, 
  MessageCircle, 
  PhoneCall, 
  CheckCircle2,
  Clock,
  CarFront
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import QuickSearch from '@/components/QuickSearch';
import FeaturedCars from '@/components/FeaturedCars';
import BrandCarousel from '@/components/BrandCarousel';
import TradeInForm from '@/components/TradeInForm';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '150-Point Certified Inspection',
      desc: 'Every engine, drivetrain, electronic control unit, and body panel undergoes rigorous multi-stage diagnostic testing by factory-trained technicians.',
    },
    {
      icon: Award,
      title: 'Guaranteed Provenance & Clean Title',
      desc: 'Complete vehicle history reports, authenticated mileage documentation, and transparent provenance tracking for total peace of mind.',
    },
    {
      icon: Truck,
      title: 'White-Glove Enclosed Delivery',
      desc: 'We transport your dream vehicle nationwide in custom climate-controlled enclosed transporters straight to your residence or private estate.',
    },
    {
      icon: Sparkles,
      title: 'Private Client Concierge',
      desc: 'Dedicated automotive advisor assisting with custom acquisition, trade-in valuations, bespoke detailing, and VIP test drives.',
    },
  ];

  return (
    <div className="bg-[#08090C]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Search / Quick Find Section */}
      <QuickSearch />

      {/* 3. Featured Cars Section */}
      <FeaturedCars />

      {/* 4. Luxury Brands Showcase */}
      <BrandCarousel />

      {/* 5. The Dream Cars Difference */}
      <section className="py-24 bg-[#0B0D12] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-rose-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">
              WHY CHOOSE DREAM CARS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The Standard of <span className="text-rose-500">Automotive Luxury</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
              We do not simply sell cars; we curate supreme automotive artistry. From rare track weapons to whisper-quiet luxury limousines, every vehicle reflects our relentless standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-[#111319] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Trade-In Section */}
      <section className="py-24 bg-[#08090C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
                <CarFront className="w-3.5 h-3.5" />
                EXPRESS TRADE-IN & UPGRADE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready for <br />
                <span className="text-rose-500">Your Next Car?</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Trade in your current vehicle and discover your next dream car. We offer transparent market evaluations, seamless paperwork handling, and competitive equity rollover into any car in our showroom inventory.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fair-market appraisal by certified automotive appraisers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct settlement with zero paperwork hassle</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Trade in any luxury or premium marque</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={getWhatsAppLink('Hello Dream Cars, I would like to trade in my current vehicle.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Trade-In via WhatsApp: 03099491835</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <TradeInForm />
            </div>

          </div>
        </div>
      </section>

      {/* 7. Direct WhatsApp VIP Showroom Consultation Banner */}
      <section className="py-16 bg-gradient-to-r from-rose-950/30 via-[#10131A] to-emerald-950/20 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">
                INSTANT PRIVATE CONCIERGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Looking for a Specific Supercar or Luxury SUV?
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Chat directly with our Showroom Director on WhatsApp for off-market inventory, private showroom appointments, or custom sourcing.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href={getWhatsAppLink('Hello Dream Cars Showroom, I am looking for a custom vehicle procurement.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CHAT ON WHATSAPP (03099491835)</span>
              </a>

              <a
                href={`tel:${SHOWROOM_PHONE}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
              >
                <PhoneCall className="w-4 h-4" />
                <span>CALL SHOWROOM</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
