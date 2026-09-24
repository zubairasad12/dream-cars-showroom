'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SHOWROOM_PHONE, SHOWROOM_WHATSAPP, getWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
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
          subject: formData.subject || 'General Showroom Inquiry',
          message: formData.message,
          inquiryType: 'General',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to transmit message');

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#08090C] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            SHOWROOM CONCIERGE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Connect with <span className="text-rose-500">Dream Cars</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Whether inquiring about a specific supercar, scheduling a private showroom appointment, or commissioning a bespoke build, our concierge team is at your service.
          </p>
        </div>

        {/* Contact Info & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom Address */}
            <div className="p-6 rounded-3xl bg-[#111319] border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Showroom Location
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Dream Cars Luxury Pavilion, Main Boulevard, Gulberg III, Lahore, Pakistan
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Card (Prominent!) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#111319] to-[#111319] border border-emerald-500/30 flex items-start gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Direct WhatsApp
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Instant response from our Showroom Director.
                </p>
                <div className="mt-3">
                  <a
                    href={getWhatsAppLink('Hello Dream Cars Showroom, I am contacting you for an inquiry.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Now: {SHOWROOM_PHONE}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="p-6 rounded-3xl bg-[#111319] border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-200 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Direct Line
                </h4>
                <a
                  href={`tel:${SHOWROOM_PHONE}`}
                  className="text-base font-bold text-white hover:text-rose-400 transition-colors block mt-1"
                >
                  {SHOWROOM_PHONE}
                </a>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Available Mon-Sat for calls & appointments
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-3xl bg-[#111319] border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-200 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Showroom Timings
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Mon – Sat: 10:00 AM – 9:00 PM
                </p>
                <p className="text-xs text-slate-500">
                  Sunday: By Exclusive Appointment Only
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111319] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white">
                  Send Showroom Message
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Submit your request and our automotive team will reply via email or phone within a few hours.
                </p>
              </div>

              {success ? (
                <div className="text-center py-12 space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Message Transmitted</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Thank you for contacting Dream Cars. Your inquiry has been routed to our showroom director.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Daniyal Sheikh"
                        className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
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
                        placeholder="e.g. 0300 1234567"
                        className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Private Showroom Viewing"
                        className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details regarding your vehicle of interest, delivery timeline, or private test drive requirements..."
                      className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-rose-950/60 hover:shadow-rose-600/30 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Transmitting Message...' : 'Submit Showroom Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Location / Google Map Section */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Showroom Pavilion & Location
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Conveniently located on Main Boulevard Gulberg, Lahore with private valet parking
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Gulberg+III+Lahore+Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors self-start"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Interactive dark styled map frame */}
          <div className="relative aspect-[21/9] min-h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-[#161922]">
            <iframe
              title="Dream Cars Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27218.42398579998!2d74.338275!3d31.512686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a27890ef9%3A0xc39f88461b171333!2sGulberg%20III%2C%20Lahore%2C%20Punjab!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
