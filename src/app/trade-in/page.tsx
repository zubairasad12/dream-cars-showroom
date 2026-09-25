import React from 'react';
import type { Metadata } from 'next';
import TradeInForm from '@/components/TradeInForm';
import { 
  CarFront, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Luxury Vehicle Trade-In & Upgrade | Dream Cars Showroom',
  description: 'Trade in your high-end automobile with Dream Cars. Get an honest fair-market appraisal, transparent rollover equity, and instant upgrade into our luxury showroom fleet.',
};

export default function TradeInPage() {
  const steps = [
    {
      num: '01',
      title: 'Submit Appraisal Details',
      desc: 'Enter your vehicle specifications, mileage, and service records using our secure trade-in form below.',
    },
    {
      num: '02',
      title: 'Comprehensive Valuation',
      desc: 'Our certified automotive appraisers inspect auction indices and real-world market metrics to provide top-tier valuation.',
    },
    {
      num: '03',
      title: 'Instant Rollover Equity',
      desc: 'Apply your trade-in equity directly toward any supercar, executive sedan, or luxury SUV in our inventory.',
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#0B0B0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase mb-3">
            <CarFront className="w-3.5 h-3.5" />
            SEAMLESS UPGRADE PROGRAM
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
            Ready for <span className="text-[#C8A96B]">Your Next Car?</span>
          </h1>
          <p className="text-[#A6A39C] text-sm sm:text-base mt-3 leading-relaxed">
            Trade in your current vehicle and discover your next dream car. Experience transparent, no-obligation valuation with white-glove concierge transition.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#1D1C19] border border-[#30302D] relative overflow-hidden"
            >
              <span className="text-4xl font-black text-[#C8A96B]/20 absolute top-4 right-6">
                {s.num}
              </span>
              <h3 className="text-lg font-bold text-[#F4F2ED] mb-2 relative z-10">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A39C] leading-relaxed relative z-10">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trade-In Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form */}
          <div className="lg:col-span-8">
            <TradeInForm />
          </div>

          {/* Sidebar Info & Direct WhatsApp */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-[#F4F2ED] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                The Dream Guarantee
              </h3>

              <div className="space-y-3 text-xs text-[#A6A39C]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>No login or customer registration required</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Transparent valuations with no hidden deductions</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct same-day bank transfer or showroom credit</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>All documentation, customs, and transfer handled by our legal team</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#30302D]">
                <p className="text-[11px] text-[#A6A39C] mb-2">Need immediate appraisal?</p>
                <a
                  href={getWhatsAppLink('Hello Dream Cars, I want to discuss trading in my vehicle right now.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 03099491835</span>
                </a>
              </div>
            </div>

            {/* Quick Link to Cars */}
            <div className="bg-[#151514] border border-[#30302D] rounded-3xl p-6 text-center space-y-3">
              <h4 className="text-sm font-bold text-[#F4F2ED]">Find Your Upgrade</h4>
              <p className="text-xs text-[#A6A39C]">
                Explore our full luxury inventory while your valuation is prepared.
              </p>
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#C8A96B]/15"
              >
                <span>View Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
