import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat('en-US').format(mileage)} km`;
}

export const SHOWROOM_PHONE = '03099491835';
export const SHOWROOM_WHATSAPP = '923099491835';

/**
 * Generates a direct WhatsApp link to 03099491835 (+923099491835)
 * with an optional custom pre-filled message.
 */
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${SHOWROOM_WHATSAPP}`;
  if (!message) {
    const defaultMsg = 'Hello Dream Cars, I am interested in exploring your luxury car showroom inventory.';
    return `${base}?text=${encodeURIComponent(defaultMsg)}`;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a specialized WhatsApp message for a specific car.
 */
export function getCarWhatsAppLink(car: { brand?: { name: string }; model: string; year: number; price: number; id: string }): string {
  const brandName = car.brand?.name || '';
  const text = `Hello Dream Cars Showroom, I am interested in inquiring about the ${car.year} ${brandName} ${car.model} (Listed at ${formatPrice(car.price)}). Could you please provide further details, inspection report, and availability?`;
  return getWhatsAppLink(text);
}
