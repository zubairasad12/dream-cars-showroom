'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SHOWROOM_PHONE, getWhatsAppLink } from '@/lib/utils';

export default function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2">
      {/* Floating interactive tooltip */}
      {showTooltip && (
        <div className="bg-[#111319]/95 text-white border border-emerald-500/30 backdrop-blur-md rounded-2xl p-3 shadow-2xl max-w-xs animate-fadeIn relative mb-1">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">Showroom Concierge Online</span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Inquire directly on WhatsApp: <span className="font-semibold text-white">{SHOWROOM_PHONE}</span>
          </p>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <a
        href={getWhatsAppLink('Hello Dream Cars Showroom, I am visiting your website and would like immediate assistance regarding your luxury cars.')}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Direct WhatsApp Contact"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none"></span>

        <MessageCircle className="w-7 h-7 text-white fill-white" />
        
        {/* Hover quick badge */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0E1017] text-white border border-emerald-500/40 text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg">
          Direct WhatsApp: 03099491835
        </span>
      </a>
    </div>
  );
}
