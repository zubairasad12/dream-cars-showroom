import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import BlogCard from '@/components/BlogCard';

interface Props {
  params: { slug: string };
}

async function getCategory(slug: string) {
  return prisma.blogCategory.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return { title: 'Category Not Found | Dream Cars Journal' };
  }

  return {
    title: `${category.name} | Dream Cars Journal`,
    description:
      category.description ||
      `${category.name} articles from the Dream Cars Journal — car insights for buyers in Pakistan.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

const PAGE_SIZE = 9;

export default async function BlogCategoryPage({
  params,
  searchParams,
}: Props & { searchParams: { page?: string } }) {
  const category = await getCategory(params.slug);
  if (!category) {
    notFound();
  }

  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const where = { status: 'Published', categoryId: category.id };

  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { publishDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0B0B0A]">
      {/* Header banner */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C8A96B]/6 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-[#A6A39C] mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#C8A96B] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#C8A96B] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#C8A96B]">{category.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151514] border border-[#30302D] text-xs font-semibold tracking-widest text-[#C8A96B] uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Category
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F4F2ED]">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-base text-[#A6A39C] mt-4 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="text-xs text-[#A6A39C] mt-3">
            {total} {total === 1 ? 'article' : 'articles'} in this category
          </p>
        </div>
      </div>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#30302D] rounded-3xl">
            <BookOpen className="w-12 h-12 text-[#30302D] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#F4F2ED] mb-2">No articles yet</h3>
            <p className="text-sm text-[#A6A39C] mb-6">
              New {category.name.toLowerCase()} articles are on the way.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A96B] hover:bg-[#D8C08A] text-[#0B0B0A] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Browse All Articles
              <ArrowRight className="w-4 h-4" />
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Link
                key={num}
                href={`/blog/category/${category.slug}?page=${num}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  num === page
                    ? 'bg-[#C8A96B] text-[#0B0B0A]'
                    : 'bg-[#1D1C19] border border-[#30302D] text-[#A6A39C] hover:text-[#F4F2ED] hover:border-[#C8A96B]/50'
                }`}
              >
                {num}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
