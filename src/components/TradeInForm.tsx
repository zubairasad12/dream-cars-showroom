'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  CarFront, 
  DollarSign, 
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function TradeInForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    currentCar: '',
    year: '',
    mileage: '',
    estimatedValue: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
          subject: `Vehicle Trade-In: ${formData.currentCar} (${formData.year})`,
          message: formData.message || `Estimated value requested: $${formData.estimatedValue}. Mileage: ${formData.mileage} km.`,
          inquiryType: 'Trade-In',
          tradeInDetails: {
            currentCar: formData.currentCar,
            year: formData.year,
            mileage: formData.mileage,
            estimatedValue: formData.estimatedValue,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit trade-in appraisal');

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        currentCar: '',
        year: '',
        mileage: '',
        estimatedValue: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111319] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      {success ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Trade-In Appraisal Request Received</h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Our luxury acquisition specialists will review your vehicle details and provide an official fair-market valuation within 24 hours.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Submit Another Valuation
            </button>
            <a
              href={getWhatsAppLink('Hello Dream Cars, I just submitted a trade-in appraisal request and would like an instant appraisal.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp: 03099491835</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Mansoor"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 0300 1234567"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Current Vehicle Make & Model *
              </label>
              <input
                type="text"
                required
                value={formData.currentCar}
                onChange={(e) => setFormData({ ...formData, currentCar: e.target.value })}
                placeholder="e.g. 2021 Porsche Macan S"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Model Year *
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2021"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Odometer Mileage (km)
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="e.g. 25000"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Expected Value (USD / PKR)
              </label>
              <input
                type="text"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                placeholder="e.g. $75,000"
                className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Additional Details & Condition Notes
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide information regarding service history, aftermarket packages, paint condition, or the Dream Cars model you wish to upgrade into..."
              className="w-full bg-[#171A24] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[11px] text-slate-500">
              No account required. Instant valuation sent to your contact.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-rose-950/60 hover:shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Submitting Valuation...' : 'Submit Trade-In Request'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
