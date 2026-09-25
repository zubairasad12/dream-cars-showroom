'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Tag,
  BookOpen
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on /admin/login, don't show the layout frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Vehicles', href: '/admin/cars', icon: Car },
    { label: 'Add Vehicle', href: '/admin/cars/new', icon: PlusCircle },
    { label: 'Brands & Marques', href: '/admin/brands', icon: Tag },
    { label: 'Blog & Journal', href: '/admin/blog', icon: BookOpen },
    { label: 'Inquiries & Leads', href: '/admin/inquiries', icon: Inbox },
    { label: 'Showroom Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#F4F2ED] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#151514] border-r border-[#30302D] shrink-0">
        
        {/* Brand header */}
        <div className="p-6 border-b border-[#30302D] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C8A96B]/30 p-0.5 bg-[#1D1C19]">
            <Image
              src="/logo.png"
              alt="Dream Cars"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm text-[#F4F2ED] tracking-wider flex items-center">
              <span className="text-[#C8A96B]">D</span>REAM CARS
            </span>
            <span className="text-[10px] uppercase font-bold text-[#A6A39C] tracking-widest block">
              Admin Suite
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#C8A96B] text-[#0B0B0A] font-bold shadow-lg shadow-[#C8A96B]/15'
                    : 'text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#1D1C19]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#30302D] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#1D1C19] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#C8A96B]" />
              <span>Live Showroom</span>
            </span>
            <span className="text-[10px] text-stone-500">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-[#151514]/90 backdrop-blur-md border-b border-[#30302D] px-6 flex items-center justify-between sticky top-0 z-30 animate-slideDown">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#1D1C19]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-[#F4F2ED] uppercase tracking-wider hidden sm:block">
              Showroom Control Center
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D1C19] border border-[#30302D] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#A6A39C] font-medium">Showroom Director</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D1C19] hover:bg-[#30302D] text-xs font-semibold text-[#F4F2ED] transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96B]" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content — re-animates on every page navigation */}
        <main key={pathname} className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-[#0B0B0A] animate-fadeUp">
          {children}
        </main>

      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex">
          <div className="w-64 bg-[#151514] h-full flex flex-col border-r border-[#30302D] p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-6 border-b border-[#30302D]">
              <span className="font-bold text-[#F4F2ED] text-sm">Menu</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-[#A6A39C] hover:text-[#F4F2ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      pathname === item.href ? 'bg-[#C8A96B] text-[#0B0B0A] font-bold' : 'text-[#A6A39C]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 text-xs font-semibold text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
