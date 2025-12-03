// Cloudflare Image Resizing utility
// Docs: https://developers.cloudflare.com/images/image-resizing/url-format/

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
 * Get the current domain dynamically
 */
const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://secondhandpro.co.il';
};

/**
 * Generate a Cloudflare Image Resizing URL
 * @param originalUrl - The original image URL (can be external like Supabase)
 * @param options - Cloudflare image transformation options
 * @returns Optimized image URL via Cloudflare CDN
 */
export const getCloudflareImageUrl = (
  originalUrl: string,
  options: CloudflareImageOptions = {}
): string => {
  // Skip if no URL or data URL
  if (!originalUrl || originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // Only process external URLs (http/https) - return local paths unchanged
  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    return originalUrl;
  }

  // Default options for optimal performance
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    fit = 'cover',
    gravity = 'auto',
    dpr,
  } = options;

  // Build the options string
  const params: string[] = [];
  
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  params.push(`quality=${quality}`);
  params.push(`format=${format}`);
  params.push(`fit=${fit}`);
  if (gravity !== 'auto') params.push(`gravity=${gravity}`);
  if (dpr) params.push(`dpr=${dpr}`);

  const optionsString = params.join(',');

  // Use current domain dynamically
  const domain = getCurrentDomain();

  // Return the Cloudflare Image Resizing URL
  return `${domain}/cdn-cgi/image/${optionsString}/${originalUrl}`;
};

/**
 * Generate responsive srcSet for different screen sizes
 * @param originalUrl - The original image URL
 * @param sizes - Array of widths to generate
 * @returns srcSet string for responsive images
 */
export const getCloudflareImageSrcSet = (
  originalUrl: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string => {
  // Skip if not an external URL
  if (!originalUrl || !originalUrl.startsWith('http')) {
    return '';
  }
  
  return sizes
    .map(size => `${getCloudflareImageUrl(originalUrl, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Predefined image size presets
 */
export const imagePresets = {
  thumbnail: { width: 150, height: 150, fit: 'cover' as const },
  card: { width: 400, height: 300, fit: 'cover' as const },
  cardLarge: { width: 600, height: 400, fit: 'cover' as const },
  hero: { width: 1200, height: 600, fit: 'cover' as const },
  full: { width: 1920, fit: 'scale-down' as const },
};
