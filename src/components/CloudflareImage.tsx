import React from 'react';
import { 
  getCloudflareImageUrl, 
  getCloudflareImageSrcSet, 
  CloudflareImageOptions,
  imagePresets 
} from '@/utils/cloudflareImage';

interface CloudflareImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Cloudflare image transformation options */
  cfOptions?: CloudflareImageOptions;
  /** Use a predefined preset */
  preset?: keyof typeof imagePresets;
  /** Generate responsive srcSet */
  responsive?: boolean;
  /** Custom sizes for responsive srcSet */
  responsiveSizes?: number[];
  /** sizes attribute for responsive images */
  sizes?: string;
}

/**
 * CloudflareImage Component
 * 
 * Automatically optimizes images through Cloudflare's Image Resizing CDN.
 * 
 * @example Basic usage with preset:
 * ```tsx
 * <CloudflareImage 
 *   src="https://storage.supabase.co/image.jpg" 
 *   alt="Product" 
 *   preset="card" 
 * />
 * ```
 * 
 * @example Custom options:
 * ```tsx
 * <CloudflareImage 
 *   src={imageUrl} 
 *   alt="Hero" 
 *   cfOptions={{ width: 1200, quality: 85, format: 'webp' }} 
 * />
 * ```
 * 
 * @example Responsive image:
 * ```tsx
 * <CloudflareImage 
 *   src={imageUrl} 
 *   alt="Product" 
 *   responsive 
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" 
 * />
 * ```
 */
export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  src,
  alt,
  cfOptions,
  preset,
  responsive = false,
  responsiveSizes,
  sizes = '100vw',
  className = '',
  loading = 'lazy',
  ...props
}) => {
  // Merge preset options with custom options
  const options = {
    ...(preset ? imagePresets[preset] : {}),
    ...cfOptions,
  };

  // Generate the optimized URL
  const optimizedSrc = getCloudflareImageUrl(src, options);

  // Generate srcSet if responsive
  const srcSet = responsive 
    ? getCloudflareImageSrcSet(src, responsiveSizes) 
    : undefined;

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      loading={loading}
      className={className}
      {...props}
    />
  );
};

export default CloudflareImage;
