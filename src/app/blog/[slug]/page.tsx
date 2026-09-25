import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, User, ArrowRight, ArrowLeft, Tag as TagIcon, Car as CarIcon, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import BlogCard, { formatDate, parseTags } from '@/components/BlogCard';
import CarCard from '@/components/CarCard';
import ShareButtons from '@/components/ShareButtons';

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      relatedCars: {
        include: { brand: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 } },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post || post.status !== 'Published') {
    return { title: 'Article Not Found | Dream Cars Journal' };
  }

  const title = post.seoTitle || `${post.title} | Dream Cars Journal`;
  const description =
    post.seoDescription ||
    post.excerpt ||
    `${post.title} — insights from the Dream Cars team in Vehari, Pakistan.`;
  const ogImage = post.coverImage || '/logo.png';
  const canonical = post.canonicalUrl || `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime: new Date(post.publishDate).toISOString(),
      authors: [post.author],
      images: [{ url: ogImage, alt: post.title }],
      siteName: 'Dream Cars Luxury Showroom',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post || post.status !== 'Published') {
    notFound();
  }

  const tags = parseTags(post.tags);

  // Related articles: same category first, then fill by shared tags, exclude self
  const relatedWhere: any = {
    status: 'Published',
    id: { not: post.id },
  };
  if (post.categoryId) {
    relatedWhere.OR = [
      { categoryId: post.categoryId },
      ...tags.map((t) => ({ tags: { contains: t } })),
    ];
  } else if (tags.length > 0) {
    relatedWhere.OR = tags.map((t) => ({ tags: { contains: t } }));
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: relatedWhere,
    include: { category: true },
    orderBy: { publishDate: 'desc' },
    take: 4,
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Dream Cars',
      logo: { '@type': 'ImageObject', url: 'https://dreamcars.com/logo.png' },
    },
    datePublished: new Date(post.publishDate).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
      ...(post.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: post.category.name,
              item: `/blog/category/${post.category.slug}`,
            },
          ]
        : []),
      { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title, item: `/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0B0B0A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#A6A39C] mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#C8A96B] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#C8A96B] transition-colors">Blog</Link>
            {post.category && (
              <>
                <span>/</span>
                <Link href={`/blog/category/${post.category.slug}`} className="hover:text-[#C8A96B] transition-colors">
                  {post.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#C8A96B] truncate max-w-[200px] sm:max-w-none">{post.title}</span>
          </nav>

          {/* Category + Title */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="px-3 py-1 rounded-full bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/40 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C8A96B]/20 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            {post.featured && (
              <span className="px-3 py-1 rounded-full bg-[#C8A96B] text-[#0B0B0A] text-[10px] font-bold uppercase tracking-widest">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F2ED] leading-tight">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#A6A39C] mt-6 pb-8 border-b border-[#30302D]">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1D1C19] border border-[#30302D] flex items-center justify-center">
                <User className="w-4 h-4 text-[#C8A96B]" />
              </span>
              <span className="font-semibold text-[#F4F2ED]">{post.author}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#30302D]" />
            <span>{formatDate(post.publishDate)}</span>
            <span className="w-1 h-1 rounded-full bg-[#30302D]" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C8A96B]" />
              {post.readingTime} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#30302D] bg-[#1D1C19] shadow-2xl">
            <Image
              src={post.coverImage || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80'}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1152px"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-[#30302D]">
              <TagIcon className="w-4 h-4 text-[#C8A96B]" />
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 rounded-full bg-[#1D1C19] border border-[#30302D] text-xs text-[#A6A39C] hover:text-[#C8A96B] hover:border-[#C8A96B]/50 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-[#30302D]">
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>

          {/* Related Cars */}
          {post.relatedCars && post.relatedCars.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F2ED] flex items-center gap-2.5 mb-6">
                <CarIcon className="w-5 h-5 text-[#C8A96B]" />
                Cars Mentioned in This Article
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {post.relatedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </section>
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F2ED] flex items-center gap-2.5 mb-6">
                <BookOpen className="w-5 h-5 text-[#C8A96B]" />
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPosts.slice(0, 3).map((related) => (
                  <BlogCard key={related.id} post={related} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C8A96B] text-[#F4F2ED] hover:bg-[#C8A96B] hover:text-[#0B0B0A] font-semibold text-xs tracking-wider uppercase transition-all"
                >
                  <span>View All Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#A6A39C] hover:text-[#C8A96B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dream Cars Journal
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
