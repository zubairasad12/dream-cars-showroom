'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Globe 
} from 'lucide-react';
import { ShowroomSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    showroomName: 'Dream Cars',
    logo: '/logo.png',
    phone: '03099491835',
    whatsapp: '923099491835',
    email: 'contact@dreamcars.com',
    address: 'Dream Cars Showroom, Khanewal Road, Front of Stadium Gate, Vehari, Punjab, Pakistan',
    openingHours: 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: Appointment Only',
    aboutText: '',
    facebook: 'https://facebook.com/dreamcars',
    instagram: 'https://instagram.com/dreamcars',
    twitter: 'https://twitter.com/dreamcars',
    youtube: 'https://youtube.com/@dreamcars',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: ShowroomSettings) => {
        if (data) {
          let socials = { facebook: '', instagram: '', twitter: '', youtube: '' };
          try {
            socials = JSON.parse(data.socialLinks);
          } catch (e) {}

          setFormData({
            showroomName: data.showroomName || 'Dream Cars',
            logo: data.logo || '/logo.png',
            phone: data.phone || '03099491835',
            whatsapp: data.whatsapp || '923099491835',
            email: data.email || 'contact@dreamcars.com',
            address: data.address || 'Dream Cars Showroom, Vehari, Punjab, Pakistan',
            openingHours: data.openingHours || '',
            aboutText: data.aboutText || '',
            facebook: socials.facebook || '',
            instagram: socials.instagram || '',
            twitter: socials.twitter || '',
            youtube: socials.youtube || '',
          });
        }
      })
      .catch((err) => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const payload = {
        showroomName: formData.showroomName,
        logo: formData.logo,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        address: formData.address,
        openingHours: formData.openingHours,
        aboutText: formData.aboutText,
        socialLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          youtube: formData.youtube,
        },
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update showroom settings');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-[#A6A39C] text-xs">Loading showroom settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#30302D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight">
            Showroom Information & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A39C] mt-1">
            Configure contact coordinates, WhatsApp hotline, address, and showroom profile.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Showroom settings successfully updated in the database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Brand & Logo */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C8A96B]" />
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Showroom Name
              </label>
              <input
                type="text"
                required
                value={formData.showroomName}
                onChange={(e) => setFormData({ ...formData, showroomName: e.target.value })}
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Logo Asset Path
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#151514] border border-[#30302D]">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#C8A96B]/30 p-0.5 bg-[#1D1C19] shrink-0">
              <Image
                src={formData.logo}
                alt="Logo Preview"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F4F2ED] block">Official Dream Cars Badge Active</span>
              <span className="text-[11px] text-[#A6A39C]">Serving from {formData.logo}</span>
            </div>
          </div>
        </div>

        {/* Contact Coordinates & WhatsApp */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D] flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            Hotline & Direct WhatsApp Integration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Direct Phone Hotline *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="03099491835"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                WhatsApp API Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="923099491835"
                className="w-full bg-[#151514] text-[#F4F2ED] border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-400 font-mono"
              />
              <span className="text-[10px] text-[#A6A39C] mt-1 block">
                Format: 923099491835 (for wa.me links)
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Concierge Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Showroom Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Showroom Opening Hours
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
              About Showroom Text
            </label>
            <textarea
              rows={3}
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D]">
            Social Media Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                Twitter / X
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C8A96B]/15"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Showroom Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
