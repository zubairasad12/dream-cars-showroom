'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Film
} from 'lucide-react';
import { CarImage, CarVideo } from '@/lib/types';

interface CarGalleryProps {
  images: CarImage[];
  videos?: CarVideo[];
  title: string;
}

type MediaItem = { type: 'video' | 'image'; url: string };

export default function CarGallery({ images, videos, title }: CarGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80';

  // Videos appear first (walkaround clips), followed by photos
  const mediaList: MediaItem[] = [
    ...(videos && videos.length > 0
      ? videos
          .filter((v) => v.videoUrl)
          .map((v) => ({ type: 'video' as const, url: v.videoUrl }))
      : []),
    ...(images && images.length > 0
      ? images.map((img) => ({ type: 'image' as const, url: img.imageUrl }))
      : []),
  ];

  if (mediaList.length === 0) {
    mediaList.push({ type: 'image', url: fallback });
  }

  const current = mediaList[Math.min(selectedIndex, mediaList.length - 1)];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaList.length]);

  return (
    <div className="space-y-4">
      {/* Main Media Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#1D1C19] border border-[#30302D] group shadow-2xl">
        {current.type === 'video' ? (
          <video
            key={current.url}
            src={current.url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        ) : (
          <>
            <Image
              src={current.url}
              alt={`${title} - View ${selectedIndex + 1}`}
              fill
              priority
              className="object-cover transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Ambient Gradient overlay (photos only) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/80 via-transparent to-black/20 pointer-events-none" />
          </>
        )}

        {/* Video badge */}
        {current.type === 'video' && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0B0B0A]/90 text-[#C8A96B] text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-[#30302D] flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            Walkaround Video
          </div>
        )}

        {/* Navigation Arrows */}
        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B0B0A]/80 hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] backdrop-blur-md border border-[#30302D] flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl z-10"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B0B0A]/80 hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] backdrop-blur-md border border-[#30302D] flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl z-10"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Button (photos only) */}
        {current.type === 'image' && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0B0B0A]/80 hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] backdrop-blur-md border border-[#30302D] transition-all shadow-lg z-10"
            title="Fullscreen Gallery"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Media Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#0B0B0A]/90 text-[#F4F2ED] text-xs font-semibold backdrop-blur-md border border-[#30302D] z-10">
          {selectedIndex + 1} / {mediaList.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {mediaList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {mediaList.map((media, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-[#151514] ${
                selectedIndex === idx
                  ? 'border-[#C8A96B] scale-105 shadow-md shadow-[#C8A96B]/20'
                  : 'border-[#30302D] opacity-60 hover:opacity-100'
              }`}
              aria-label={media.type === 'video' ? `Play video ${idx + 1}` : `View photo ${idx + 1}`}
            >
              {media.type === 'video' ? (
                <>
                  <video
                    src={media.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="w-7 h-7 rounded-full bg-[#C8A96B] text-[#0B0B0A] flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </span>
                  </span>
                </>
              ) : (
                <Image
                  src={media.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal View (images only — videos use native controls) */}
      {isFullscreen && current.type === 'image' && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0A]/98 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#1D1C19] hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] border border-[#30302D] transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center">
            <Image
              src={current.url}
              alt={`${title} fullscreen`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {mediaList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#1D1C19]/80 hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] border border-[#30302D] flex items-center justify-center transition-all shadow-2xl"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#1D1C19]/80 hover:bg-[#C8A96B] hover:text-[#0B0B0A] text-[#F4F2ED] border border-[#30302D] flex items-center justify-center transition-all shadow-2xl"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
