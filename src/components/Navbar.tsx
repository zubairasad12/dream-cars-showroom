'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  MessageCircle 
} from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The admin portal has its own layout — never render the public navbar there
  if (pathname?.startsWith('/admin')) {
    return null;
  }

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
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0B0A]/95 backdrop-blur-md border-b border-[#30302D] py-3.5 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-[#0B0B0A]/95 via-[#0B0B0A]/70 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: DREAM CARS Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#30302D] p-0.5 shadow-lg group-hover:border-[#C8A96B]/70 transition-colors bg-[#1D1C19]">
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
                <span className="font-extrabold text-xl tracking-wider text-[#F4F2ED] flex items-center leading-none">
                  <span className="text-[#C8A96B]">D</span>REAM
                  <span className="text-[#C8A96B] ml-1 font-semibold">CARS</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#A6A39C] uppercase font-medium mt-0.5">
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
                        ? 'text-[#F4F2ED] font-semibold'
                        : 'text-[#A6A39C] hover:text-[#F4F2ED]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96B] rounded-full animate-fadeIn" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3.5">
              {/* WhatsApp direct contact */}
              <a
                href={getWhatsAppLink('Hello Dream Cars, I would like to inquire about your luxury showroom cars.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#151514] hover:bg-[#1D1C19] text-[#C8A96B] border border-[#30302D] hover:border-[#C8A96B]/50 transition-all text-xs font-semibold tracking-wide"
                title="Direct WhatsApp Chat: 03099491835"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>03099491835</span>
              </a>

              {/* View Cars Primary CTA */}
              <Link
                href="/cars"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[#C8A96B]/20"
              >
                <span>VIEW CARS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#151514] border border-[#30302D] transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B0B0A] border-b border-[#30302D] px-6 py-6 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    pathname === link.href ? 'text-[#C8A96B] font-semibold' : 'text-[#A6A39C] hover:text-[#F4F2ED]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-[#30302D] flex flex-col gap-3">
                <a
                  href={getWhatsAppLink('Hello Dream Cars, I am interested in inquiring about your vehicles.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#151514] text-[#C8A96B] border border-[#30302D] text-sm font-semibold"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>WhatsApp: 03099491835</span>
                </a>

                <Link
                  href="/cars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C8A96B] text-[#0B0B0A] text-sm font-bold uppercase tracking-wider shadow-lg"
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
