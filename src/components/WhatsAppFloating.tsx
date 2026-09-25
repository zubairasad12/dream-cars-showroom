'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(true);
  const pathname = usePathname();

  // The admin portal has its own layout — never render the public widget there
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2">
      {/* Floating interactive tooltip */}
      {showTooltip && (
        <div className="bg-[#1D1C19]/98 text-[#F4F2ED] border border-[#C8A96B]/40 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl max-w-xs animate-fadeIn relative mb-1">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-[#A6A39C] hover:text-[#F4F2ED]"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-[#C8A96B]">Showroom Concierge Online</span>
          </div>
          <p className="text-xs text-[#A6A39C] leading-snug">
            Inquire directly on WhatsApp: <span className="font-semibold text-[#F4F2ED]">{SHOWROOM_PHONE}</span>
          </p>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <a
        href={getWhatsAppLink('Hello Dream Cars Showroom, I am visiting your website and would like immediate assistance regarding your luxury cars.')}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Direct WhatsApp Contact"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none"></span>

        <MessageCircle className="w-7 h-7 text-white fill-white" />
        
        {/* Hover quick badge */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg">
          Direct WhatsApp: 03099491835
        </span>
      </a>
    </div>
  );
}
