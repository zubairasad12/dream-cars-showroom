export interface CarImage {
  id: string;
  carId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: string | Date;
}

export interface CarVideo {
  id: string;
  carId: string;
  videoUrl: string;
  sortOrder: number;
  createdAt?: string | Date;
}

export interface BlogCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string | Date;
  _count?: { posts: number };
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string | null;
  author: string;
  tags: string | string[];
  readingTime: number;
  featured: boolean;
  status: 'Draft' | 'Published' | string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  publishDate: string | Date;
  categoryId?: string | null;
  category?: BlogCategoryItem | null;
  relatedCars?: Car[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string | null;
  active: boolean;
  createdAt?: string | Date;
  _count?: {
    cars: number;
  };
}

export interface Car {
  id: string;
  brandId: string;
  brand?: Brand;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  engine: string;
  horsepower: number;
  bodyType: string;
  condition: string;
  exteriorColor: string;
  interiorColor: string;
  driveType: string;
  description: string;
  features: string | string[];
  featured: boolean;
  status: 'Available' | 'Reserved' | 'Sold' | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  images: CarImage[];
  videos: CarVideo[];
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  carId?: string | null;
  car?: {
    id: string;
    model: string;
    year: number;
    price: number;
    brand: { name: string };
    images: { imageUrl: string }[];
  } | null;
  subject: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed' | string;
  inquiryType: 'General' | 'Car Inquiry' | 'Trade-In' | string;
  tradeInDetails?: string | null;
  createdAt: string | Date;
}

export interface ShowroomSettings {
  id: string;
  showroomName: string;
  logo: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  socialLinks: string;
  aboutText: string;
  updatedAt?: string | Date;
}
