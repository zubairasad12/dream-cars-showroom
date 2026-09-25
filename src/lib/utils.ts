import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Pakistani Rupees (PKR) with proper comma separation.
 * Examples: PKR 8,500,000, PKR 12,500,000, PKR 3,850,000
 */
export function formatPrice(price: number): string {
  const numericPrice = typeof price === 'number' ? price : Number(price) || 0;
  return `PKR ${new Intl.NumberFormat('en-US').format(Math.round(numericPrice))}`;
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat('en-US').format(mileage)} km`;
}

export const SHOWROOM_PHONE = '03099491835';
export const SHOWROOM_PHONE_INTL = '+92 309 9491835';
export const SHOWROOM_WHATSAPP = '923099491835';
export const SHOWROOM_LOCATION = 'Vehari, Punjab, Pakistan';

/**
 * Generates a direct WhatsApp link to 03099491835 (+923099491835)
 * with an optional custom pre-filled message.
 */
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${SHOWROOM_WHATSAPP}`;
  if (!message) {
    const defaultMsg = 'Hello Dream Cars Vehari, I am interested in exploring your showroom inventory.';
    return `${base}?text=${encodeURIComponent(defaultMsg)}`;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a specialized WhatsApp message for a specific car.
 */
export function getCarWhatsAppLink(car: { brand?: { name: string }; model: string; year: number; price: number; id: string }): string {
  const brandName = car.brand?.name || '';
  const text = `Hello Dream Cars Vehari, I am interested in inquiring about the ${car.year} ${brandName} ${car.model} (Listed at ${formatPrice(car.price)}). Could you please provide further details, inspection report, and availability?`;
  return getWhatsAppLink(text);
}
