'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' && url.startsWith('/')
    ? `${window.location.origin}${url}`
    : url;

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareWhatsApp = () => {
    window.open(
      getWhatsAppLink(`${title} — ${fullUrl}`),
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    );
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — ignore
    }
  };

  const btnClass =
    'flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1D1C19] hover:bg-[#242320] border border-[#30302D] hover:border-[#C8A96B]/50 text-xs font-semibold text-[#F4F2ED] transition-all active:scale-95';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-4 h-4 text-[#C8A96B]" />
        <span className="text-xs font-bold text-[#F4F2ED] uppercase tracking-wider">
          Share This Article
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={shareWhatsApp} className={btnClass} aria-label="Share on WhatsApp">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-400 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-2.6-.9-4.3-2.5-5.6-4.7-.7-1.2-1-2.3-.7-3.2.1-.5.8-1.4 1.4-1.4h.7c.2 0 .4.1.5.5l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4-.1.6.5 1 1.5 2 2.6 2.5.2.1.4.1.6-.1l.7-.7c.2-.2.4-.2.6-.1l1.7.8c.3.2.4.3.4.5s0 .8-.3 1.3z" />
          </svg>
          <span>WhatsApp</span>
        </button>

        <button onClick={shareFacebook} className={btnClass} aria-label="Share on Facebook">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400 fill-current" aria-hidden="true">
            <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.7-1.6h1.5V3.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.7H7.8V13h2.7v8h3z" />
          </svg>
          <span>Facebook</span>
        </button>

        <button onClick={shareX} className={btnClass} aria-label="Share on X">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F4F2ED] fill-current" aria-hidden="true">
            <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L2 3h6.4l4.4 5.9L17.5 3zm-1.1 16.1h1.7L7.1 4.8H5.3l11.1 14.3z" />
          </svg>
          <span>X</span>
        </button>

        <button onClick={copyLink} className={btnClass} aria-label="Copy link">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 text-[#C8A96B]" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
