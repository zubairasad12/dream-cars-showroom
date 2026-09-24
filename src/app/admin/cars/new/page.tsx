'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  UploadCloud, 
  Trash2, 
  Star, 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  AlertCircle, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Brand } from '@/lib/types';

interface ImageItem {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export default function NewCarPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    brandId: '',
    model: '',
    year: '2024',
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '',
    horsepower: '',
    bodyType: 'Sedan',
    condition: 'Brand New',
    exteriorColor: '',
    interiorColor: '',
    driveType: 'AWD',
    description: '',
    featured: false,
    status: 'Available',
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Features list
  const [features, setFeatures] = useState<string[]>([
    'Bose / Burmester Surround Sound',
    'Heated & Ventilated Massage Seats',
    '360-Degree Surround Camera',
    'Apple CarPlay & Android Auto',
    'Adaptive Cruise Control',
    'Panoramic Glass Sunroof',
    'Head-Up Display',
    'Carbon Ceramic Brakes'
  ]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetch('/api/brands?activeOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          setFormData((prev) => ({ ...prev, brandId: data[0].id }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Multi-image file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      if (json.urls && Array.isArray(json.urls)) {
        const newImages: ImageItem[] = json.urls.map((url: string, index: number) => ({
          imageUrl: url,
          isPrimary: images.length === 0 && index === 0,
          sortOrder: images.length + index,
        }));
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Add image by direct URL
  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;

    setImages((prev) => [
      ...prev,
      {
        imageUrl: customImageUrl.trim(),
        isPrimary: prev.length === 0,
        sortOrder: prev.length,
      },
    ]);
    setCustomImageUrl('');
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    if (!features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
    }
    setNewFeature('');
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter((f) => f !== feat));
  };

  // Submit Car creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (images.length === 0) {
      setError('Please upload or provide at least one photo for this vehicle.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        features,
        images,
      };

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create vehicle');

      router.push('/admin/cars');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating car');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Add New Luxury Vehicle
            </h1>
            <p className="text-xs text-slate-400">
              Upload multiple angles, set detailed specs, and publish to the showroom.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/60"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving Vehicle...' : 'Publish Vehicle'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: MULTIPLE IMAGE UPLOAD */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-rose-500" />
                Vehicle Photography ({images.length} Photos)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Front, rear, side, interior cockpit, engine, wheels. Drag, select, or input URLs.
              </p>
            </div>

            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-widest">
              High Resolution Gallery
            </span>
          </div>

          {/* Upload Dropzone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Drag/Select */}
            <label className="border-2 border-dashed border-white/15 hover:border-rose-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#161922] flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-white block">
                {uploading ? 'Processing & Uploading...' : 'Click or Drag Multiple Photos'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                PNG, JPG, WEBP, AVIF supported
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Direct Image URL input */}
            <div className="border border-white/10 rounded-2xl p-6 bg-[#161922] flex flex-col justify-center">
              <span className="text-xs font-bold text-white block mb-1">
                Add Image from Direct URL
              </span>
              <p className="text-[10px] text-slate-400 mb-3">
                Paste high-res Unsplash or external photography URL
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 bg-[#111319] text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Images Preview Reel with Reorder and Set Primary */}
          {images.length > 0 && (
            <div className="space-y-3 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Gallery ({images.length}) • Click star to set Cover Image
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group bg-slate-900 ${
                      img.isPrimary ? 'border-rose-500 shadow-lg shadow-rose-950/50' : 'border-white/10'
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`Upload ${idx + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Primary Badge */}
                    {img.isPrimary && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                        Cover Photo
                      </span>
                    )}

                    {/* Hover Overlay Controls */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className={`p-1.5 rounded-lg ${
                            img.isPrimary ? 'bg-rose-600 text-white' : 'bg-black/50 text-slate-300 hover:text-white'
                          }`}
                          title="Set as Cover Photo"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="p-1.5 rounded-lg bg-red-950/70 hover:bg-red-600 text-red-300 hover:text-white"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'left')}
                          className="p-1 rounded bg-black/60 text-white hover:bg-rose-600 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMoveImage(idx, 'right')}
                          className="p-1 rounded bg-black/60 text-white hover:bg-rose-600 disabled:opacity-30"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: BASIC VEHICLE ATTRIBUTES */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Core Vehicle Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Brand */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Marque / Brand *
              </label>
              <select
                required
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Model Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. M5 Competition"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Year *
              </label>
              <input
                type="number"
                required
                placeholder="2024"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                required
                placeholder="125000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Mileage (km)
              </label>
              <input
                type="number"
                placeholder="3500"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Showroom Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Engine
              </label>
              <input
                type="text"
                placeholder="e.g. 4.4L Twin-Turbo V8"
                value={formData.engine}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Horsepower
              </label>
              <input
                type="number"
                placeholder="e.g. 617"
                value={formData.horsepower}
                onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Transmission
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Dual-Clutch">Dual-Clutch / PDK</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Fuel Type
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Body Type
              </label>
              <select
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="SUV">SUV</option>
                <option value="Sports">Sports</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Drivetrain
              </label>
              <select
                value={formData.driveType}
                onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="AWD">AWD</option>
                <option value="RWD">RWD</option>
                <option value="FWD">FWD</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Brand New">Brand New</option>
                <option value="Certified Luxury">Certified Luxury</option>
                <option value="Pre-Owned Collector">Pre-Owned Collector</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Exterior Color
              </label>
              <input
                type="text"
                placeholder="e.g. Marina Bay Blue"
                value={formData.exteriorColor}
                onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Interior Color
              </label>
              <input
                type="text"
                placeholder="e.g. Black Merino Leather"
                value={formData.interiorColor}
                onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vehicle Narrative & Description
            </label>
            <textarea
              rows={4}
              placeholder="Highlight provenance, bespoke options, performance metrics, and history..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredCheckbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 bg-[#161922] border-white/20 focus:ring-rose-500"
            />
            <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-white cursor-pointer select-none">
              Mark as Featured Vehicle (Displays in Homepage Featured Collection)
            </label>
          </div>
        </div>

        {/* SECTION 4: LUXURY OPTIONS & FEATURES */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Luxury Features & Packages
            </h2>
            <span className="text-[11px] text-slate-400">
              {features.length} options selected
            </span>
          </div>

          {/* Add custom feature */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add package (e.g. Night Package, Carbon Roof)"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Add
            </button>
          </div>

          {/* Active Features Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {features.map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161922] border border-white/10 text-xs text-slate-200"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feat)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Bottom Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/cars"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-rose-950/60"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Publishing Vehicle...' : 'Save & Publish Vehicle'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
