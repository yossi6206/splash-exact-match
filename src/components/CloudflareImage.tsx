import React, { useState } from 'react';
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
  /** Display width hint for optimization */
  displayWidth?: number;
}

/**
 * CloudflareImage Component with automatic fallback
 * 
 * Automatically optimizes images through Cloudflare's Image Resizing CDN.
 * Falls back to original URL if Cloudflare fails.
 * For Unsplash images, uses their native optimization parameters.
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
  displayWidth,
  onError,
  ...props
}) => {
  const [useFallback, setUseFallback] = useState(false);

  // Merge preset options with custom options, including displayWidth
  const options: CloudflareImageOptions = {
    ...(preset ? imagePresets[preset] : {}),
    ...(displayWidth ? { width: displayWidth } : {}),
    ...cfOptions,
  };

  // Use original URL if fallback is triggered, otherwise try optimization
  const optimizedSrc = useFallback ? src : getCloudflareImageUrl(src, options);

  // Generate srcSet if responsive (only if not in fallback mode)
  const srcSet = responsive && !useFallback
    ? getCloudflareImageSrcSet(src, responsiveSizes) 
    : undefined;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If optimized URL failed and we haven't tried fallback yet
    if (!useFallback && optimizedSrc !== src) {
      console.log('Image optimization failed, falling back to original:', src);
      setUseFallback(true);
    }
    // Call original onError if provided
    onError?.(e);
  };

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={responsive && !useFallback ? sizes : undefined}
      alt={alt}
      loading={loading}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default CloudflareImage;
