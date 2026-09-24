import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { SHOWROOM_PHONE, SHOWROOM_WHATSAPP, getWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="bg-[#060709] border-t border-white/10 pt-16 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 p-0.5 bg-[#111319]">
                <Image
                  src="/logo.png"
                  alt="Dream Cars Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-white flex items-center leading-none">
                  <span className="text-rose-500">D</span>REAM
                  <span className="text-slate-300 ml-1 font-semibold">CARS</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-medium mt-0.5">
                  Exclusive Luxury Showroom
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Discover Pakistan&apos;s most prestigious collection of exotic, performance, and ultra-luxury automobiles. Curated with unyielding passion and verified by factory-certified specialists.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppLink('Hello Dream Cars Showroom, I am contacting you from your official website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>DIRECT WHATSAPP: 03099491835</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Showroom Home</Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">Featured Inventory</Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">Luxury Brands</Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-white transition-colors">Vehicle Trade-In</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Dream Cars</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Showroom Concierge</Link>
              </li>
            </ul>
          </div>

          {/* Luxury Marques */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white">
              Featured Marques
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/brands/porsche" className="hover:text-white transition-colors">Porsche</Link>
              </li>
              <li>
                <Link href="/brands/mercedes-benz" className="hover:text-white transition-colors">Mercedes-AMG</Link>
              </li>
              <li>
                <Link href="/brands/bmw" className="hover:text-white transition-colors">BMW M Power</Link>
              </li>
              <li>
                <Link href="/brands/audi" className="hover:text-white transition-colors">Audi RS</Link>
              </li>
              <li>
                <Link href="/brands/land-rover" className="hover:text-white transition-colors">Range Rover SV</Link>
              </li>
              <li>
                <Link href="/brands/toyota" className="hover:text-white transition-colors">Land Cruiser GR</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white">
              Showroom Pavilion
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                <span className="text-xs leading-relaxed text-slate-300">
                  Main Boulevard, Gulberg III, Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <a href={`tel:${SHOWROOM_PHONE}`} className="text-xs text-slate-300 hover:text-white transition-colors">
                  {SHOWROOM_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-emerald-400 hover:underline"
                >
                  WhatsApp: +92 309 9491835
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-400">
                  <p>Mon - Sat: 10:00 AM - 9:00 PM</p>
                  <p className="text-slate-500">Sunday: By Appointment</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DREAM CARS SHOWROOM. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              150-Point Certified Inspection
            </span>
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
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
