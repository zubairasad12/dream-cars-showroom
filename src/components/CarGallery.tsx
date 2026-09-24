'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X 
} from 'lucide-react';
import { CarImage } from '@/lib/types';

interface CarGalleryProps {
  images: CarImage[];
  title: string;
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80';
  const imageList = images && images.length > 0 ? images.map((img) => img.imageUrl) : [fallback];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageList.length]);

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/10 group shadow-2xl">
        <Image
          src={imageList[selectedIndex]}
          alt={`${title} - View ${selectedIndex + 1}`}
          fill
          priority
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg"
          title="Fullscreen Gallery"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Photo Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 text-slate-300 text-xs font-semibold backdrop-blur-md border border-white/10">
          {selectedIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {imageList.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-rose-500 scale-105 shadow-lg shadow-rose-950/60'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center">
            <Image
              src={imageList[selectedIndex]}
              alt={`${title} fullscreen`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-2xl"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-2xl"
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
