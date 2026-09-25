import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowRight, Search, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import BlogCard, { formatDate } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Dream Cars Journal | Car Reviews, Buying Guides & Automotive Insights',
  description:
    'Insights, reviews and guides for car enthusiasts and buyers in Pakistan — from Dream Cars Vehari. Car comparisons, maintenance tips, fuel economy advice and more.',
  keywords: [
    'Dream Cars Journal',
    'Car Reviews Pakistan',
    'Car Buying Guides Pakistan',
    'Cars in Pakistan',
    'Vehari Cars',
  ],
};

interface Props {
  searchParams: { q?: string; category?: string; tag?: string; page?: string };
}

const PAGE_SIZE = 9;

export default async function BlogPage({ searchParams }: Props) {
  const q = searchParams.q || '';
  const categorySlug = searchParams.category || '';
  const tag = searchParams.tag || '';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));

  const where: any = { status: 'Published' };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
      { tags: { contains: q } },
      { category: { name: { contains: q } } },
    ];
  }
  if (tag) {
    where.tags = { contains: tag };
  }
  if (categorySlug && categorySlug !== 'all') {
    where.category = { slug: categorySlug };
  }

  const [total, posts, categories, featuredPost] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { publishDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { status: 'Published' } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.blogPost.findFirst({
      where: { status: 'Published', featured: true, ...(q || categorySlug ? {} : {}) },
      include: { category: true },
      orderBy: { publishDate: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (categorySlug) params.set('category', categorySlug);
    if (pageNum > 1) params.set('page', String(pageNum));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0B0A]">
      {/* Ambient gold glow */}
      <div className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C8A96B]/6 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#A6A39C] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#C8A96B] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#C8A96B]">Blog</span>
          </nav>

          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Dream Cars Journal
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F4F2ED] leading-tight">
              Insights &amp; <span className="gold-gradient-text">Automotive Stories</span>
            </h1>
            <p className="text-base sm:text-lg text-[#A6A39C] mt-4 leading-relaxed">
              Reviews, buying guides and practical advice for car enthusiasts and buyers in
              Pakistan — written by the Dream Cars team in Vehari.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {featuredPost && page === 1 && !q && !categorySlug && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <article className="group relative rounded-3xl overflow-hidden border border-[#30302D] bg-[#1D1C19] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <Link href={`/blog/${featuredPost.slug}`} className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden">
                <Image
                  src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1C19]/80 via-transparent to-transparent lg:bg-gradient-to-r" />
              </Link>

              {/* Content */}
              <div className="p-7 sm:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {featuredPost.category && (
                    <span className="px-3 py-1 rounded-full bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/40 text-[10px] font-bold uppercase tracking-widest">
                      {featuredPost.category.name}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-[#C8A96B] text-[#0B0B0A] text-[10px] font-bold uppercase tracking-widest">
                    Featured
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2ED] leading-snug group-hover:text-[#D8C08A] transition-colors">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-[#A6A39C] leading-relaxed mt-4 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#A6A39C] mt-5">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C8A96B]" />
                    {featuredPost.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#30302D]" />
                  <span>{formatDate(featuredPost.publishDate)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#30302D]" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8A96B]" />
                    {featuredPost.readingTime} min read
                  </span>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs tracking-wider uppercase transition-all w-fit"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Search + Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <form action="/blog" method="get" className="flex gap-3 max-w-xl mb-6">
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6A39C]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search automotive articles..."
              className="w-full bg-[#1D1C19] text-[#F4F2ED] border border-[#30302D] focus:border-[#C8A96B] rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-[#A6A39C]/50 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              !categorySlug
                ? 'bg-[#C8A96B] text-[#0B0B0A] border-[#C8A96B] font-bold'
                : 'bg-[#1D1C19] text-[#A6A39C] hover:text-[#F4F2ED] border-[#30302D] hover:border-[#C8A96B]/50'
            }`}
          >
            All Articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                categorySlug === cat.slug
                  ? 'bg-[#C8A96B] text-[#0B0B0A] border-[#C8A96B] font-bold'
                  : 'bg-[#1D1C19] text-[#A6A39C] hover:text-[#F4F2ED] border-[#30302D] hover:border-[#C8A96B]/50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeCategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#F4F2ED]">
              Category: <span className="text-[#C8A96B]">{activeCategory.name}</span>
            </h2>
            {activeCategory.description && (
              <p className="text-sm text-[#A6A39C] mt-2">{activeCategory.description}</p>
            )}
          </div>
        )}

        {q && (
          <p className="text-sm text-[#A6A39C] mb-8">
            {total} {total === 1 ? 'article' : 'articles'} found for{' '}
            <span className="text-[#C8A96B] font-semibold">&ldquo;{q}&rdquo;</span>
          </p>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#30302D] rounded-3xl">
            <BookOpen className="w-12 h-12 text-[#30302D] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#F4F2ED] mb-2">No articles found</h3>
            <p className="text-sm text-[#A6A39C] mb-6">
              Try a different search term or browse another category.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              View All Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="px-4 py-2.5 rounded-xl bg-[#1D1C19] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50 text-xs font-semibold transition-colors"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Link
                key={num}
                href={buildPageUrl(num)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  num === page
                    ? 'bg-[#C8A96B] text-[#0B0B0A]'
                    : 'bg-[#1D1C19] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50'
                }`}
              >
                {num}
              </Link>
            ))}

            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="px-4 py-2.5 rounded-xl bg-[#1D1C19] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50 text-xs font-semibold transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
