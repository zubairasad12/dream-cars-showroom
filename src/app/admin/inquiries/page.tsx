'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Inbox, 
  Trash2, 
  Phone, 
  Mail, 
  MessageCircle, 
  Car, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Inquiry } from '@/lib/types';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setInquiries(data);
    } catch (err: any) {
      setError('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq))
        );
      }
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage inquiries, trade-in valuations, and contact requests submitted through the showroom website.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#111319] text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Inquiries</option>
              <option value="Car Inquiry">Car Inquiries</option>
              <option value="Trade-In">Trade-In Appraisals</option>
              <option value="General">General Inquiries</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111319] text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-[#111319] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No inquiries found</p>
            <p className="text-xs text-slate-400">Client leads will appear here automatically when submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161922] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Type & Subject</th>
                  <th className="py-3.5 px-4">Interested Vehicle</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {inquiries.map((inq) => {
                  let tradeDetails: any = null;
                  if (inq.tradeInDetails) {
                    try {
                      tradeDetails = JSON.parse(inq.tradeInDetails);
                    } catch (e) {}
                  }

                  return (
                    <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white text-sm block">
                          {inq.name}
                        </span>
                        <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <a href={`tel:${inq.phone}`} className="hover:text-white">
                              {inq.phone}
                            </a>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <a href={`mailto:${inq.email}`} className="hover:text-white">
                              {inq.email}
                            </a>
                          </span>
                        </div>
                      </td>

                      {/* Subject & Message */}
                      <td className="py-4 px-4 max-w-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                            {inq.inquiryType}
                          </span>
                          <span className="font-semibold text-white truncate text-xs">
                            {inq.subject}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {inq.message}
                        </p>

                        {tradeDetails && (
                          <div className="mt-1.5 p-2 rounded-lg bg-[#161922] text-[10px] text-slate-300 border border-white/5">
                            Trade Vehicle: <strong>{tradeDetails.currentCar} ({tradeDetails.year})</strong> • Est: ${tradeDetails.estimatedValue}
                          </div>
                        )}
                      </td>

                      {/* Interested Car */}
                      <td className="py-4 px-4">
                        {inq.car ? (
                          <Link
                            href={`/cars/${inq.car.id}`}
                            target="_blank"
                            className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
                          >
                            <span>{inq.car.year} {inq.car.brand.name} {inq.car.model}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-500 text-[11px]">General Inquiry</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(inq.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border focus:outline-none ${
                            inq.status === 'New'
                              ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                              : inq.status === 'Contacted'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Direct WhatsApp Contact to client */}
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${inq.name}, this is Dream Cars Showroom regarding your inquiry: ${inq.subject}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="Chat with client on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
