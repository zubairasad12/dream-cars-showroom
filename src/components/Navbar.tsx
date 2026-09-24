'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  Search, 
  ArrowUpRight, 
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Cars', href: '/cars' },
    { label: 'Brands', href: '/brands' },
    { label: 'Trade-In', href: '/trade-in' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#08090C]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#08090C]/90 via-[#08090C]/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: DREAM CARS Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-lg group-hover:border-rose-500/50 transition-colors bg-[#111319]">
                <Image
                  src="/logo.png"
                  alt="Dream Cars Luxury Showroom Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-white flex items-center leading-none">
                  <span className="text-rose-500">D</span>REAM
                  <span className="text-slate-300 ml-1 font-semibold">CARS</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-medium mt-0.5">
                  Luxury Showroom
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 rounded-full animate-fadeIn" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-4">
              {/* WhatsApp direct contact */}
              <a
                href={getWhatsAppLink('Hello Dream Cars, I would like to inquire about your luxury showroom cars.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all text-xs font-semibold tracking-wide"
                title="Direct WhatsApp Chat: 03099491835"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>03099491835</span>
              </a>

              {/* View Inventory CTA */}
              <Link
                href="/cars"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs tracking-wider transition-all shadow-lg shadow-rose-950/40 hover:shadow-rose-600/30"
              >
                <span>VIEW CARS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0B10]/98 border-b border-white/10 backdrop-blur-xl px-6 py-6 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    pathname === link.href ? 'text-rose-500 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={getWhatsAppLink('Hello Dream Cars, I am interested in inquiring about your vehicles.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp: 03099491835</span>
                </a>

                <Link
                  href="/cars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold shadow-lg shadow-rose-950/50"
                >
                  <span>BROWSE INVENTORY</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
