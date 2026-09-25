'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@dreamcars.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C8A96B]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-block p-1 rounded-full border border-[#30302D] bg-[#1D1C19] shadow-2xl">
            <Image
              src="/logo.png"
              alt="Dream Cars Logo"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4F2ED] tracking-wide">
            DREAM CARS <span className="text-[#C8A96B]">ADMIN</span>
          </h1>
          <p className="text-xs text-[#A6A39C]">
            Secure Showroom Management Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#30302D]">
            <ShieldCheck className="w-5 h-5 text-[#C8A96B]" />
            <h2 className="text-sm font-bold text-[#F4F2ED] uppercase tracking-wider">
              Director Authentication
            </h2>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dreamcars.com"
                  className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A6A39C] uppercase tracking-wider block mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C8A96B]/15 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Access Showroom Control'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Seed demo credential callout */}
          <div className="p-3 rounded-xl bg-[#151514] border border-[#30302D] text-center space-y-1">
            <span className="text-[10px] text-[#A6A39C] uppercase font-semibold tracking-wider block">
              Default Seeded Credentials
            </span>
            <p className="text-xs text-[#C8A96B] font-mono font-medium">
              admin@dreamcars.com / admin123456
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[#A6A39C] hover:text-[#F4F2ED] transition-colors"
          >
            ← Return to Public Showroom
          </Link>
        </div>

      </div>
    </div>
  );
}
