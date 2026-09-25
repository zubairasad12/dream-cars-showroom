'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  const pathname = usePathname();

  // The admin portal has its own layout — never render the public footer there
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0B0B0A] border-t border-[#30302D] pt-16 pb-10 text-[#A6A39C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#30302D]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#30302D] p-0.5 bg-[#1D1C19]">
                <Image
                  src="/logo.png"
                  alt="Dream Cars Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-[#F4F2ED] flex items-center leading-none">
                  <span className="text-[#C8A96B]">D</span>REAM
                  <span className="text-[#C8A96B] ml-1 font-semibold">CARS</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#A6A39C] uppercase font-medium mt-0.5">
                  Exclusive Luxury Showroom
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#A6A39C] max-w-sm">
              Discover Pakistan&apos;s most prestigious collection of exotic, performance, and ultra-luxury automobiles. Curated with unyielding passion and verified by factory-certified specialists.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppLink('Hello Dream Cars Showroom, I am contacting you from your official website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#151514] hover:bg-[#1D1C19] text-[#C8A96B] border border-[#30302D] hover:border-[#C8A96B]/50 text-xs font-semibold tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>DIRECT WHATSAPP: 03099491835</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#F4F2ED]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#F4F2ED] transition-colors">Showroom Home</Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-[#F4F2ED] transition-colors">Featured Inventory</Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#F4F2ED] transition-colors">Luxury Brands</Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-[#F4F2ED] transition-colors">Vehicle Trade-In</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F4F2ED] transition-colors">About Dream Cars</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F4F2ED] transition-colors">Showroom Concierge</Link>
              </li>
            </ul>
          </div>

          {/* Luxury Marques */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#F4F2ED]">
              Featured Marques
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/brands/porsche" className="hover:text-[#F4F2ED] transition-colors">Porsche</Link>
              </li>
              <li>
                <Link href="/brands/mercedes-benz" className="hover:text-[#F4F2ED] transition-colors">Mercedes-AMG</Link>
              </li>
              <li>
                <Link href="/brands/bmw" className="hover:text-[#F4F2ED] transition-colors">BMW M Power</Link>
              </li>
              <li>
                <Link href="/brands/audi" className="hover:text-[#F4F2ED] transition-colors">Audi RS</Link>
              </li>
              <li>
                <Link href="/brands/land-rover" className="hover:text-[#F4F2ED] transition-colors">Range Rover SV</Link>
              </li>
              <li>
                <Link href="/brands/toyota" className="hover:text-[#F4F2ED] transition-colors">Land Cruiser GR</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#F4F2ED]">
              Showroom Pavilion
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A96B] mt-1 shrink-0" />
                <span className="text-xs leading-relaxed text-[#F4F2ED]">
                  Vehari, Punjab, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <a href={`tel:${SHOWROOM_PHONE}`} className="text-xs text-[#F4F2ED] hover:text-[#C8A96B] transition-colors font-medium">
                  {SHOWROOM_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#C8A96B] hover:underline font-medium"
                >
                  WhatsApp: +92 309 9491835
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C8A96B] mt-0.5 shrink-0" />
                <div className="text-xs text-[#A6A39C]">
                  <p>Mon - Sat: 10:00 AM - 9:00 PM</p>
                  <p className="text-slate-500">Sunday: By Appointment</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A6A39C]">
          <p>© {new Date().getFullYear()} DREAM CARS SHOWROOM. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#F4F2ED]">
              <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
              150-Point Certified Inspection
            </span>
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-[#A6A39C] hover:text-[#C8A96B] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
