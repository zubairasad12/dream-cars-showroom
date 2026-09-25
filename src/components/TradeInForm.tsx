'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
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
          message: formData.message || `Estimated value requested: PKR ${formData.estimatedValue}. Mileage: ${formData.mileage} km.`,
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
    <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A96B]/5 rounded-full blur-[120px] pointer-events-none" />

      {success ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#151514] text-[#C8A96B] border border-[#C8A96B]/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#F4F2ED]">Trade-In Appraisal Request Received</h3>
          <p className="text-[#A6A39C] text-sm max-w-md mx-auto">
            Our luxury acquisition specialists will review your vehicle details and provide an official fair-market valuation within 24 hours.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 rounded-full bg-[#151514] hover:bg-[#242320] border border-[#30302D] text-[#F4F2ED] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Submit Another Valuation
            </button>
            <a
              href={getWhatsAppLink('Hello Dream Cars, I just submitted a trade-in appraisal request and would like an instant appraisal.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-900" />
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
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Mansoor"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 0309 1234567"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Current Vehicle Make & Model *
              </label>
              <input
                type="text"
                required
                value={formData.currentCar}
                onChange={(e) => setFormData({ ...formData, currentCar: e.target.value })}
                placeholder="e.g. 2021 Porsche Macan S"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Model Year *
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2021"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Odometer Mileage (km)
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="e.g. 25000"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Expected Value (PKR)
              </label>
              <input
                type="text"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                placeholder="e.g. PKR 7,500,000"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
              Additional Details & Condition Notes
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide information regarding service history, aftermarket packages, paint condition, or the Dream Cars model you wish to upgrade into..."
              className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[11px] text-[#A6A39C]">
              No account required. Instant valuation sent to your contact.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C8A96B]/25 flex items-center justify-center gap-2"
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
