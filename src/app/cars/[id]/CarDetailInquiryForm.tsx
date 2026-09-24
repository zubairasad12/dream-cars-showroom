'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, MessageCircle, PhoneCall } from 'lucide-react';
import { Car } from '@/lib/types';
import { getCarWhatsAppLink, SHOWROOM_PHONE, formatPrice } from '@/lib/utils';

interface Props {
  car: Car;
}

export default function CarDetailInquiryForm({ car }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `Hello Dream Cars, I am interested in this ${car.year} ${car.brand?.name} ${car.model}. Please contact me regarding private viewing and final pricing.`,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const brandName = car.brand?.name || 'Exclusive';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          carId: car.id,
          subject: `Vehicle Inquiry: ${car.year} ${brandName} ${car.model}`,
          message: formData.message,
          inquiryType: 'Car Inquiry',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
      <div>
        <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest block mb-1">
          RESERVE OR INQUIRE
        </span>
        <h3 className="text-xl font-bold text-white">
          Send Showroom Inquiry
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Our concierge will promptly respond with complete vehicle dossier.
        </p>
      </div>

      {success ? (
        <div className="text-center py-8 space-y-3 bg-[#161922] rounded-2xl p-4 border border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Inquiry Received</h4>
          <p className="text-xs text-slate-300">
            Thank you, {formData.name}. Our luxury sales manager has been notified and will contact you via phone/WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href={getCarWhatsAppLink(car)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue on WhatsApp: 03099491835</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Asad Malik"
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 0309 1234567"
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@domain.com"
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Inquiry Note
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Transmitting...' : 'Send Inquiry To Showroom'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* WhatsApp quick contact */}
      <div className="pt-2 text-center border-t border-white/10">
        <p className="text-[11px] text-slate-400 mb-2">Prefer instant conversation?</p>
        <a
          href={getCarWhatsAppLink(car)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat about this vehicle on WhatsApp: {SHOWROOM_PHONE}</span>
        </a>
      </div>
    </div>
  );
}
