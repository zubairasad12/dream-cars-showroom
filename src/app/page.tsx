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
  CarFront
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import QuickSearch from '@/components/QuickSearch';
import FeaturedCars from '@/components/FeaturedCars';
import BrandCarousel from '@/components/BrandCarousel';
import TradeInForm from '@/components/TradeInForm';
import BlogCard from '@/components/BlogCard';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';
import prisma from '@/lib/prisma';

// Inventory and journal change often — always render with fresh data
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const latestPosts = await prisma.blogPost.findMany({
    where: { status: 'Published' },
    include: { category: true },
    orderBy: { publishDate: 'desc' },
    take: 3,
  });

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
    <div className="bg-[#0B0B0A] text-[#F4F2ED]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Search / Quick Find Section */}
      <QuickSearch />

      {/* 3. Featured Cars Section */}
      <FeaturedCars />

      {/* 4. Luxury Brands Showcase */}
      <BrandCarousel />

      {/* 5. The Dream Cars Difference */}
      <section className="py-24 bg-[#151514] relative overflow-hidden border-t border-b border-[#30302D]">
        {/* Subtle Gold Glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-[#C8A96B]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest block mb-2">
              WHY CHOOSE DREAM CARS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
              The Standard of <span className="text-[#C8A96B]">Automotive Luxury</span>
            </h2>
            <p className="text-[#A6A39C] text-sm sm:text-base mt-4 leading-relaxed">
              We do not simply sell cars; we hand-pick the finest vehicles for Pakistani roads. From brand new local favourites and fresh Japanese imports to premium luxury SUVs, every vehicle meets our relentless standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-[#1D1C19] border border-[#30302D] hover:border-[#C8A96B] transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#151514] text-[#C8A96B] border border-[#30302D] flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F4F2ED] mb-3">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A6A39C] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Trade-In Section */}
      <section className="py-24 bg-[#0B0B0A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151514] text-[#C8A96B] border border-[#30302D] text-xs font-bold uppercase tracking-wider">
                <CarFront className="w-3.5 h-3.5" />
                EXPRESS TRADE-IN & UPGRADE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight leading-tight">
                Ready for <br />
                <span className="text-[#C8A96B]">Your Next Car?</span>
              </h2>

              <p className="text-[#A6A39C] text-sm sm:text-base leading-relaxed">
                Trade in your current vehicle and discover your next dream car. We offer transparent market evaluations, seamless paperwork handling, and competitive equity rollover into any car in our showroom inventory.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-[#F4F2ED]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>Fair-market appraisal by certified automotive appraisers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#F4F2ED]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>Direct settlement with zero paperwork hassle</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#F4F2ED]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>Trade in any luxury or premium marque</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={getWhatsAppLink('Hello Dream Cars, I would like to trade in my current vehicle.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C8A96B]/25"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-950" />
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

      {/* 7. From the Dream Cars Journal (Latest Blog Articles) */}
      {latestPosts.length > 0 && (
        <section className="py-24 bg-[#0B0B0A] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-[#C8A96B]/5 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest block mb-2">
                  Dream Cars Journal
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F2ED] tracking-tight">
                  From the <span className="gold-gradient-text">Journal</span>
                </h2>
                <p className="text-[#A6A39C] text-sm sm:text-base mt-3 leading-relaxed">
                  Car buying guides, honest reviews, and maintenance advice for drivers in Pakistan — straight from our showroom floor.
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C8A96B] text-[#F4F2ED] hover:bg-[#C8A96B] hover:text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shrink-0 w-fit"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Direct WhatsApp VIP Showroom Consultation Banner */}
      <section className="py-16 bg-[#151514] border-t border-b border-[#30302D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest block mb-1">
                INSTANT PRIVATE CONCIERGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED]">
                Looking for a Specific Supercar or Luxury SUV?
              </h3>
              <p className="text-[#A6A39C] text-sm mt-1 max-w-xl">
                Chat directly with our Showroom Director on WhatsApp for off-market inventory, private showroom appointments, or custom sourcing.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href={getWhatsAppLink('Hello Dream Cars Showroom, I am looking for a custom vehicle procurement.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-[#C8A96B]/25"
              >
                <MessageCircle className="w-4 h-4 text-emerald-950" />
                <span>CHAT ON WHATSAPP (03099491835)</span>
              </a>

              <a
                href={`tel:${SHOWROOM_PHONE}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-[#C8A96B] text-[#F4F2ED] hover:text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-colors border border-[#C8A96B]"
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
