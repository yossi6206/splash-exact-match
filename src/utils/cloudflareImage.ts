// Cloudflare Image Resizing utility
// Docs: https://developers.cloudflare.com/images/image-resizing/url-format/

const CLOUDFLARE_DOMAIN = 'https://secondhandpro.co.il';

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
 * Optimize Unsplash URLs with their native parameters
 */
export const getOptimizedUnsplashUrl = (
  url: string,
  width?: number,
  quality: number = 80
): string => {
  if (!url.includes('images.unsplash.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    // Set optimal parameters for Unsplash
    if (width) {
      urlObj.searchParams.set('w', width.toString());
    }
    urlObj.searchParams.set('fm', 'webp'); // Use WebP format
    urlObj.searchParams.set('q', quality.toString()); // Set quality
    urlObj.searchParams.set('auto', 'format'); // Auto format selection
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Generate a Cloudflare Image Resizing URL
 * Uses secondhandpro.co.il as the Cloudflare domain
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

  // For Unsplash URLs, use their native optimization
  if (originalUrl.includes('images.unsplash.com')) {
    return getOptimizedUnsplashUrl(originalUrl, options.width, options.quality);
  }

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

  return `${CLOUDFLARE_DOMAIN}/cdn-cgi/image/${optionsString}/${originalUrl}`;
};

/**
 * Generate responsive srcSet for different screen sizes
 */
export const getCloudflareImageSrcSet = (
  originalUrl: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string => {
  if (!originalUrl || !originalUrl.startsWith('http')) {
    return '';
  }
  
  // For Unsplash, use their native srcset
  if (originalUrl.includes('images.unsplash.com')) {
    return sizes
      .map(size => `${getOptimizedUnsplashUrl(originalUrl, size)} ${size}w`)
      .join(', ');
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
