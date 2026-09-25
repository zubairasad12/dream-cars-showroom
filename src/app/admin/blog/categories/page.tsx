'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Tag, Edit, Trash2, AlertCircle } from 'lucide-react';
import { BlogCategoryItem } from '@/lib/types';

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        editingId ? `/api/blog/categories/${editingId}` : '/api/blog/categories',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, description }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      resetForm();
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat: BlogCategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
  };

  const handleDelete = async (cat: BlogCategoryItem) => {
    if (!window.confirm(`Delete category "${cat.name}"? Articles will keep existing without a category.`)) return;
    try {
      const res = await fetch(`/api/blog/categories/${cat.id}`, { method: 'DELETE' });
      if (res.ok) await loadCategories();
    } catch {
      // ignore
    }
  };

  const inputClass =
    'w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]';
  const labelClass = 'text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#30302D]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-[#1D1C19] hover:bg-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight flex items-center gap-3">
              <Tag className="w-6 h-6 text-[#C8A96B]" />
              Blog Categories
            </h1>
            <p className="text-xs text-[#A6A39C] mt-0.5">
              Organize journal articles into topics.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-4"
      >
        <h2 className="text-sm font-bold text-[#F4F2ED] uppercase tracking-wider">
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Car Reviews"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug (auto from name if empty)</label>
            <input
              type="text"
              placeholder="car-reviews"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description (optional)</label>
          <input
            type="text"
            placeholder="Short description shown on the category page"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-[#151514] border border-[#30302D] text-[#A6A39C] text-xs font-semibold hover:text-[#F4F2ED] transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Categories list */}
      {loading ? (
        <div className="text-center py-12 text-[#A6A39C] text-xs">Loading categories...</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#1D1C19] border border-[#30302D]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#F4F2ED]">{cat.name}</h3>
                  <span className="text-[10px] text-[#A6A39C]">/blog/category/{cat.slug}</span>
                </div>
                {cat.description && (
                  <p className="text-[11px] text-[#A6A39C] mt-1 truncate">{cat.description}</p>
                )}
                <p className="text-[10px] text-[#A6A39C]/70 mt-0.5">
                  {cat._count?.posts ?? 0} published {cat._count?.posts === 1 ? 'article' : 'articles'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-2 rounded-lg bg-[#151514] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50 transition-colors"
                  title="Edit category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-2 rounded-lg bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#30302D] rounded-3xl">
              <p className="text-sm text-[#A6A39C]">No categories yet — add your first one above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
