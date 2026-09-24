'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Brand } from '@/lib/types';

interface ImageItem {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

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
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    // 1. Fetch active brands
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error(err));

    // 2. Fetch car data
    if (id) {
      fetch(`/api/cars/${id}`)
        .then((res) => res.json())
        .then((car) => {
          if (car && !car.error) {
            setFormData({
              brandId: car.brandId,
              model: car.model,
              year: car.year.toString(),
              price: car.price.toString(),
              mileage: car.mileage.toString(),
              fuelType: car.fuelType,
              transmission: car.transmission,
              engine: car.engine,
              horsepower: car.horsepower.toString(),
              bodyType: car.bodyType,
              condition: car.condition,
              exteriorColor: car.exteriorColor,
              interiorColor: car.interiorColor,
              driveType: car.driveType,
              description: car.description || '',
              featured: Boolean(car.featured),
              status: car.status || 'Available',
            });

            if (car.images && Array.isArray(car.images)) {
              setImages(
                car.images.map((img: any, i: number) => ({
                  imageUrl: img.imageUrl,
                  isPrimary: img.isPrimary,
                  sortOrder: img.sortOrder ?? i,
                }))
              );
            }

            try {
              setFeatures(JSON.parse(car.features));
            } catch (e) {
              setFeatures(car.features ? car.features.split(',').map((f: string) => f.trim()) : []);
            }
          }
        })
        .catch((err) => setError('Failed to load vehicle: ' + err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (images.length === 0) {
      setError('Vehicle must have at least one photo.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        features,
        images,
      };

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update vehicle');

      router.push('/admin/cars');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-xs">Loading vehicle data...</div>;
  }

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
              Edit Vehicle: {formData.model}
            </h1>
            <p className="text-xs text-slate-400">
              Update photos, price, status, and technical specifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/cars/${id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            <span>View Live</span>
          </Link>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Update Vehicle'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* MULTIPLE IMAGE MANAGEMENT */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-rose-500" />
                Manage Vehicle Photos ({images.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Reorder, delete, add new uploads, or set cover photo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-white/15 hover:border-rose-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#161922] flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-white block">
                {uploading ? 'Uploading Files...' : 'Upload Additional Photos'}
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

            <div className="border border-white/10 rounded-2xl p-6 bg-[#161922] flex flex-col justify-center">
              <span className="text-xs font-bold text-white block mb-1">
                Add Image from URL
              </span>
              <div className="flex gap-2 mt-2">
                <input
                  type="url"
                  placeholder="https://..."
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

          {/* Existing Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group bg-slate-900 ${
                  img.isPrimary ? 'border-rose-500 shadow-lg shadow-rose-950/50' : 'border-white/10'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />

                {img.isPrimary && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                    Cover Photo
                  </span>
                )}

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
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

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

        {/* BASIC SPECS */}
        <div className="bg-[#111319] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Vehicle Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Brand
              </label>
              <select
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

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Model Name
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Model Year
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Mileage (km)
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Horsepower
              </label>
              <input
                type="number"
                value={formData.horsepower}
                onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
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
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#161922] text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editFeatured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 bg-[#161922] border-white/20"
            />
            <label htmlFor="editFeatured" className="text-xs font-semibold text-white cursor-pointer select-none">
              Mark as Featured Vehicle
            </label>
          </div>
        </div>

        {/* BOTTOM SAVE */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/cars"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-rose-950/60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
