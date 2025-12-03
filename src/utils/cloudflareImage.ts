// Cloudflare Image Resizing utility
// Note: Cloudflare Image Resizing requires Pro/Business/Enterprise plan
// Currently disabled - images load directly from source

export interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'json';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  dpr?: number;
}

/**
 * Get image URL - currently returns original URL
 * When Cloudflare Image Resizing is enabled, this will optimize images via CDN
 */
export const getCloudflareImageUrl = (
  originalUrl: string,
  _options: CloudflareImageOptions = {}
): string => {
  // Return original URL as-is (Cloudflare Image Resizing not enabled)
  return originalUrl || '';
};

/**
 * Generate responsive srcSet - currently returns empty string
 */
export const getCloudflareImageSrcSet = (
  _originalUrl: string,
  _sizes: number[] = [400, 800, 1200, 1600]
): string => {
  // Disabled - would generate srcSet when Cloudflare is enabled
  return '';
};

/**
 * Predefined image size presets (for future use)
 */
export const imagePresets = {
  thumbnail: { width: 150, height: 150, fit: 'cover' as const },
  card: { width: 400, height: 300, fit: 'cover' as const },
  cardLarge: { width: 600, height: 400, fit: 'cover' as const },
  hero: { width: 1200, height: 600, fit: 'cover' as const },
  full: { width: 1920, fit: 'scale-down' as const },
};
