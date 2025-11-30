import React from 'react';

/**
 * OptimizedImage Component
 * 
 * קומפוננטת עזר לתמונות מאופטמות עם vite-imagetools
 * 
 * דוגמאות שימוש:
 * 
 * שימוש בסיסי (המרה פשוטה ל-WebP):
 * ```tsx
 * // @ts-ignore - vite-imagetools
 * import heroWebp from '@/assets/hero-car.jpg?format=webp&quality=85';
 * 
 * <OptimizedImage src={heroWebp} alt="רכב" />
 * ```
 * 
 * שימוש עם Picture element (מומלץ!):
 * ```tsx
 * // @ts-ignore - vite-imagetools
 * import heroAvif from '@/assets/hero-car.jpg?format=avif&quality=85';
 * // @ts-ignore - vite-imagetools
 * import heroWebp from '@/assets/hero-car.jpg?format=webp&quality=85';
 * import heroJpg from '@/assets/hero-car.jpg';
 * 
 * <picture>
 *   <source srcSet={heroAvif} type="image/avif" />
 *   <source srcSet={heroWebp} type="image/webp" />
 *   <OptimizedImage src={heroJpg} alt="רכב" />
 * </picture>
 * ```
 * 
 * שימוש עם srcset:
 * ```tsx
 * // @ts-ignore - vite-imagetools
 * import heroSet from '@/assets/hero-car.jpg?w=400;800;1200&format=webp&as=srcset';
 * 
 * <OptimizedImage 
 *   srcSet={heroSet}
 *   sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
 *   alt="רכב"
 * />
 * ```
 * 
 * למידע מפורט ראה: IMAGE_OPTIMIZATION_GUIDE.md
 */

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  srcSet?: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  srcSet,
  alt,
  loading = 'lazy',
  className = '',
  ...props
}) => {
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      loading={loading}
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;
