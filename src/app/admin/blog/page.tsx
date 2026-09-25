'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  BookOpen,
  Edit,
  Trash2,
  Star,
  Search,
  ExternalLink,
} from 'lucide-react';
import { BlogPostItem } from '@/lib/types';
import { formatDate, parseTags } from '@/components/BlogCard';

type StatusTab = 'all' | 'Published' | 'Draft' | 'featured';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<StatusTab>('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tab === 'featured') params.set('featured', 'true');
      else if (tab !== 'all') params.set('status', tab);
      if (search.trim()) params.set('q', search.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  };

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'all', label: 'All Articles' },
    { key: 'Published', label: 'Published' },
    { key: 'Draft', label: 'Drafts' },
    { key: 'featured', label: 'Featured' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#30302D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-[#C8A96B]" />
            Blog &amp; Journal
          </h1>
          <p className="text-xs text-[#A6A39C] mt-1">
            Write, publish and manage articles for the Dream Cars Journal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/categories"
            className="px-4 py-2.5 rounded-xl bg-[#1D1C19] hover:bg-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] text-xs font-semibold transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/15"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Article</span>
          </Link>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t.key
                  ? 'bg-[#C8A96B] text-[#0B0B0A] font-bold'
                  : 'bg-[#1D1C19] text-[#A6A39C] hover:text-[#F4F2ED] border border-[#30302D]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6A39C]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151514] text-[#F4F2ED] border border-[#30302D] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#C8A96B]"
          />
        </form>
      </div>

      {/* Articles list */}
      {loading ? (
        <div className="text-center py-16 text-[#A6A39C] text-xs">Loading articles...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#30302D] rounded-3xl">
          <BookOpen className="w-10 h-10 text-[#30302D] mx-auto mb-3" />
          <p className="text-sm text-[#A6A39C] mb-4">No articles found for this filter.</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C8A96B] hover:text-[#D8C08A]"
          >
            <PlusCircle className="w-4 h-4" />
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const cover = post.coverImage || '/logo.png';
            return (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-[#1D1C19] border border-[#30302D] hover:border-[#C8A96B]/50 transition-colors"
              >
                {/* Thumb */}
                <div className="relative w-full sm:w-32 h-20 rounded-xl overflow-hidden bg-[#151514] shrink-0">
                  <Image src={cover} alt={post.title} fill className="object-cover" sizes="128px" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {post.category && (
                      <span className="px-2 py-0.5 rounded bg-[#C8A96B]/10 text-[#C8A96B] text-[9px] font-bold uppercase tracking-wider border border-[#C8A96B]/30">
                        {post.category.name}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        post.status === 'Published'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-0.5 rounded bg-[#C8A96B] text-[#0B0B0A] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#F4F2ED] truncate">{post.title}</h3>
                  <p className="text-[10px] text-[#A6A39C] mt-0.5">
                    {post.author} • {formatDate(post.publishDate)} • {post.readingTime} min read
                    {parseTags(post.tags).length > 0 && ` • ${parseTags(post.tags).length} tags`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === 'Published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-[#151514] border border-[#30302D] text-[#A6A39C] hover:text-[#C8A96B] transition-colors"
                      title="View live article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-2 rounded-lg bg-[#151514] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50 transition-colors"
                    title="Edit article"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-lg bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
