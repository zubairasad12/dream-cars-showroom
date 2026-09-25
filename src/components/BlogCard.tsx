import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, User } from 'lucide-react';
import { BlogPostItem } from '@/lib/types';

export function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface BlogCardProps {
  post: BlogPostItem;
}

export default function BlogCard({ post }: BlogCardProps) {
  const cover =
    post.coverImage ||
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="group flex flex-col rounded-2xl bg-[#1D1C19] border border-[#30302D] hover:border-[#C8A96B] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-black/40 h-full">
      {/* Cover Image */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-[#151514]">
        <Image
          src={cover}
          alt={post.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1C19] via-transparent to-black/20 opacity-60" />
        {post.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B0B0A]/90 text-[#C8A96B] border border-[#C8A96B]/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            {post.category.name}
          </span>
        )}
        {post.featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#C8A96B] text-[#0B0B0A] text-[10px] font-bold uppercase tracking-wider">
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-[11px] text-[#A6A39C] mb-3">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-[#C8A96B]" />
            {post.author}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#30302D]" />
          <span>{formatDate(post.publishDate)}</span>
          <span className="w-1 h-1 rounded-full bg-[#30302D]" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C8A96B]" />
            {post.readingTime} min read
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-bold text-[#F4F2ED] leading-snug group-hover:text-[#D8C08A] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-[#A6A39C] leading-relaxed mt-2 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#30302D]">
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C8A96B] hover:text-[#D8C08A] uppercase tracking-wider transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          {parseTags(post.tags).length > 0 && (
            <span className="text-[10px] text-[#A6A39C]/70 truncate max-w-[40%]">
              #{parseTags(post.tags)[0].replace(/\s+/g, '')}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
