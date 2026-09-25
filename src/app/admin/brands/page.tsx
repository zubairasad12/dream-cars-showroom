'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  AlertCircle, 
  Tag
} from 'lucide-react';
import { Brand } from '@/lib/types';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (Array.isArray(data)) setBrands(data);
    } catch (err: any) {
      setError('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    setName('');
    setLogo('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80');
    setDescription('');
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setLogo(b.logo);
    setDescription(b.description || '');
    setActive(b.active);
    setModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo, description, active }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save brand');

      setModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      setError(err.message || 'Error saving brand');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (b: Brand) => {
    try {
      const res = await fetch(`/api/brands/${b.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !b.active }),
      });
      if (res.ok) {
        setBrands((prev) =>
          prev.map((item) => (item.id === b.id ? { ...item, active: !item.active } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (b: Brand) => {
    if (!confirm(`Are you sure you want to delete brand "${b.name}"?`)) return;

    try {
      const res = await fetch(`/api/brands/${b.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete brand');
      setBrands((prev) => prev.filter((item) => item.id !== b.id));
    } catch (err: any) {
      alert(err.message || 'Error deleting brand');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30302D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight">
            Brand & Marque Management
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A39C] mt-1">
            Add luxury marques, upload logos, toggle active showroom visibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brands Table */}
      <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#A6A39C]">Loading brands...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151514] text-[#A6A39C] font-bold uppercase tracking-wider border-b border-[#30302D]">
                <tr>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Vehicles in DB</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30302D] text-[#A6A39C]">
                {brands.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#F4F2ED] text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#151514] border border-[#30302D] flex items-center justify-center p-1.5">
                          <Tag className="w-4 h-4 text-[#C8A96B]" />
                        </div>
                        <span>{b.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#A6A39C]">
                      {b.slug}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-[#A6A39C]">
                      {b.description || 'No description'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#151514] text-[#F4F2ED] font-semibold text-[11px] border border-[#30302D]">
                        {b._count?.cars || 0} Cars
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(b)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          b.active
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#151514] text-stone-500 border border-[#30302D]'
                        }`}
                      >
                        {b.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-[#151514] hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#A6A39C] transition-colors"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#30302D]">
              <h3 className="text-lg font-bold text-[#F4F2ED] uppercase tracking-wider">
                {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Add New Marque'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#A6A39C] hover:text-[#F4F2ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aston Martin, Ferrari, Bentley"
                  className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                  Logo / Photo URL
                </label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1">
                  Description / Heritage
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Engineering pedigree, racing heritage, flagship characteristics..."
                  className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="brandActiveCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C8A96B] bg-[#151514] border-[#30302D] focus:ring-[#C8A96B]"
                />
                <label htmlFor="brandActiveCheck" className="text-xs font-semibold text-[#F4F2ED] cursor-pointer select-none">
                  Active Brand (Visible in filters and showcase)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#30302D]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#151514] hover:bg-[#30302D] text-[#A6A39C] text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
