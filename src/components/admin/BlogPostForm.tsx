'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  UploadCloud,
  Trash2,
  ArrowLeft,
  Save,
  AlertCircle,
  Film,
  Car as CarIcon,
  X,
  Eye,
} from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { BlogCategoryItem, Car, BlogPostItem } from '@/lib/types';

interface BlogPostFormProps {
  postId?: string; // present = edit mode
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(postId);

  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    author: 'Dream Cars Team',
    tags: '',
    readingTime: 5,
    featured: false,
    status: 'Draft',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    publishDate: new Date().toISOString().slice(0, 10),
    categoryId: '',
  });
  const [content, setContent] = useState('');
  const [relatedCarIds, setRelatedCarIds] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);

  // Load categories + cars + (edit mode) post
  useEffect(() => {
    fetch('/api/blog/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    fetch('/api/cars?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.cars)) setAllCars(data.cars);
      })
      .catch(() => {});

    if (postId) {
      fetch(`/api/blog/${postId}`)
        .then((res) => res.json())
        .then((post: BlogPostItem) => {
          if (post && !('error' in (post as any))) {
            setFormData({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || '',
              coverImage: post.coverImage || '',
              author: post.author || 'Dream Cars Team',
              tags: Array.isArray(post.tags) ? post.tags.join(', ') : (() => { try { return JSON.parse(post.tags as string).join(', '); } catch { return ''; } })(),
              readingTime: post.readingTime || 5,
              featured: Boolean(post.featured),
              status: post.status || 'Draft',
              seoTitle: post.seoTitle || '',
              seoDescription: post.seoDescription || '',
              canonicalUrl: post.canonicalUrl || '',
              publishDate: new Date(post.publishDate).toISOString().slice(0, 10),
              categoryId: post.categoryId || (post.category ? post.category.id : ''),
            });
            setContent(post.content || '');
            if (Array.isArray(post.relatedCars)) {
              setRelatedCarIds(post.relatedCars.map((c) => c.id));
            }
            setSlugTouched(true);
          }
        })
        .catch((err) => setError('Failed to load article: ' + err.message));
    }
  }, [postId]);

  // Auto slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80),
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCover(true);
    setError('');
    try {
      const data = new FormData();
      data.append('files', files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Cover upload failed');
      if (json.urls && json.urls.length > 0) {
        setFormData((prev) => ({ ...prev, coverImage: json.urls[0] }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const toggleRelatedCar = (carId: string) => {
    setRelatedCarIds((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.title.trim() || !content.trim()) {
      setError('Title and article content are required.');
      setSaving(false);
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: tagsArray,
        content,
        relatedCarIds,
        slug: formData.slug.trim(),
      };

      const res = await fetch(isEdit ? `/api/blog/${postId}` : '/api/blog', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save article');

      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error saving article');
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]';
  const labelClass = 'text-[11px] font-bold text-[#A6A39C] uppercase tracking-wider block mb-1';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#30302D]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-[#1D1C19] hover:bg-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight">
              {isEdit ? 'Edit Article' : 'New Journal Article'}
            </h1>
            <p className="text-xs text-[#A6A39C] mt-0.5">
              {wordCount} words • approx {Math.max(1, Math.round(wordCount / 200))} min read
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && formData.slug && formData.status === 'Published' && (
            <Link
              href={`/blog/${formData.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1D1C19] hover:bg-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] text-xs font-semibold transition-colors"
            >
              <Eye className="w-4 h-4 text-[#C8A96B]" />
              <span>Preview</span>
            </Link>
          )}
          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Update Article' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION: Article Content */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D]">
            Article Content
          </h2>

          <div>
            <label className={labelClass}>Article Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Best Cars to Buy in Pakistan in 2026"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>URL Slug</label>
              <input
                type="text"
                placeholder="best-cars-to-buy-in-pakistan-2026"
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                className={inputClass}
              />
              {formData.slug && (
                <p className="text-[10px] text-[#A6A39C] mt-1">/blog/{formData.slug}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Excerpt (short summary shown on cards)</label>
            <textarea
              rows={2}
              placeholder="One or two sentences summarizing the article..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Article Body * (rich text editor)</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              onStatsChange={(stats) => setWordCount(stats.words)}
            />
          </div>
        </div>

        {/* SECTION: Media */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D] flex items-center gap-2">
            <Film className="w-4 h-4 text-[#C8A96B]" />
            Cover Image
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-[#30302D] hover:border-[#C8A96B]/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#151514] flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-stone-500 mb-2" />
              <span className="text-xs font-bold text-[#F4F2ED] block">
                {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
              </span>
              <span className="text-[10px] text-[#A6A39C] mt-1">JPG, PNG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} className="hidden" />
            </label>

            <div className="border border-[#30302D] rounded-2xl p-4 bg-[#151514] flex flex-col">
              <span className="text-xs font-bold text-[#F4F2ED] block mb-2">Preview</span>
              {formData.coverImage ? (
                <div className="relative flex-1 min-h-[140px] rounded-xl overflow-hidden">
                  <Image src={formData.coverImage} alt="Cover preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white"
                    title="Remove cover image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 min-h-[140px] rounded-xl border border-dashed border-[#30302D] flex items-center justify-center text-[10px] text-[#A6A39C]">
                  No cover image selected
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Or paste image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* SECTION: Publish Settings */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D]">
            Publishing Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={inputClass}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Publish Date</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Reading Time (min)</label>
              <input
                type="number"
                min={1}
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value, 10) || 5 })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="Toyota, Honda, Used Cars, Pakistan Cars"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className={inputClass}
            />
            <p className="text-[10px] text-[#A6A39C] mt-1">
              Tags become clickable links on the article page.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="blogFeatured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-[#C8A96B] bg-[#151514] border-[#30302D] focus:ring-[#C8A96B]"
            />
            <label htmlFor="blogFeatured" className="text-xs font-semibold text-[#F4F2ED] cursor-pointer select-none">
              Mark as Featured (large highlight at the top of the Blog page)
            </label>
          </div>
        </div>

        {/* SECTION: Related Cars */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="pb-3 border-b border-[#30302D]">
            <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider flex items-center gap-2">
              <CarIcon className="w-4 h-4 text-[#C8A96B]" />
              Cars Mentioned in This Article ({relatedCarIds.length})
            </h2>
            <p className="text-xs text-[#A6A39C] mt-1">
              Selected cars appear on the article page with links to their detail pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
            {allCars.map((car) => {
              const selected = relatedCarIds.includes(car.id);
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => toggleRelatedCar(car.id)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all ${
                    selected
                      ? 'bg-[#C8A96B]/10 border-[#C8A96B] text-[#F4F2ED]'
                      : 'bg-[#151514] border-[#30302D] text-[#A6A39C] hover:border-[#C8A96B]/50 hover:text-[#F4F2ED]'
                  }`}
                >
                  <span className="truncate font-semibold">
                    {car.brand?.name} {car.model} ({car.year})
                  </span>
                  {selected && <X className="w-3.5 h-3.5 text-[#C8A96B] shrink-0 rotate-45" />}
                </button>
              );
            })}
            {allCars.length === 0 && (
              <p className="text-xs text-[#A6A39C] col-span-full py-4 text-center">
                No vehicles in inventory yet.
              </p>
            )}
          </div>
        </div>

        {/* SECTION: SEO */}
        <div className="bg-[#1D1C19] border border-[#30302D] rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-[#F4F2ED] uppercase tracking-wider pb-3 border-b border-[#30302D]">
            SEO Settings
          </h2>

          <div>
            <label className={labelClass}>SEO Title (leave empty to use article title)</label>
            <input
              type="text"
              placeholder="e.g. 2025 Peugeot 2008 Review: Features & Specs | Dream Cars"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              rows={2}
              placeholder="Unique, naturally written meta description (150-160 characters)..."
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Canonical URL (optional)</label>
            <input
              type="text"
              placeholder="/blog/your-article-slug"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/admin/blog"
            className="px-6 py-3 rounded-xl bg-[#1D1C19] hover:bg-[#30302D] text-[#A6A39C] text-xs font-bold uppercase transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] disabled:opacity-50 text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C8A96B]/15"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
