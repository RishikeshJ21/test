import React, { useState, useEffect, memo } from 'react';
import { getOptimalImageSize } from '../utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  blur?: boolean;
  sizes?: string;
}

/**
 * OptimizedImage component for better performance
 * - Uses native lazy loading for images below the fold
 * - Provides proper width/height to avoid layout shifts
 * - Uses modern image formats when available
 * - Automatically sizes images appropriately
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  blur = false,
  sizes = '100vw'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [error, setError] = useState(false);

  // Calculate aspect ratio to maintain proper dimensions
  const aspectRatio = width / height;

  // Get optimized image URL
  const imgSrc = error ? src : getOptimalImageSize(src, width, height);

  // Trigger loaded state when image loads
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle error by falling back to original source
  const handleError = () => {
    console.warn(`Failed to load optimized image: ${imgSrc}`);
    setError(true);
  };

  // Set up IntersectionObserver for images below the fold
  useEffect(() => {
    if (priority || isLoaded) return;

    // Create intersection observer to detect when image enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Image is in viewport, load it
          const img = entries[0].target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }

          // Stop observing
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before image enters viewport
    );

    // Find the image element and start observing
    const imgElement = document.querySelector(`[data-image-id="${src}"]`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [src, priority, isLoaded]);

  // For high-priority images (above the fold)
  if (priority) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoaded ? 'loaded' : ''}`}
        style={{ aspectRatio: `${aspectRatio}` }}
        data-image-id={src}
        sizes={sizes}
      />
    );
  }

  // For images with blur effect (like thumbnails)
  if (blur) {
    return (
      <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
        {/* Low-res placeholder */}
        <img
          src={getOptimalImageSize(src, Math.floor(width / 10), Math.floor(height / 10), 10)}
          alt={alt}
          width={width}
          height={height}
          className={`${className} blur-up`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            aspectRatio: `${aspectRatio}`
          }}
        />

        {/* Full-resolution lazy-loaded image */}
        <img
          src={isLoaded ? imgSrc : undefined}
          data-src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          className={`${className} ${isLoaded ? 'loaded' : 'lazy-image'}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in',
            aspectRatio: `${aspectRatio}`
          }}
          data-image-id={src}
          sizes={sizes}
        />
      </div>
    );
  }

  // Standard lazy-loaded image
  return (
    <img
      src={isLoaded ? imgSrc : undefined}
      data-src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      className={`${className} ${isLoaded ? 'loaded' : 'lazy-image'}`}
      style={{ aspectRatio: `${aspectRatio}` }}
      data-image-id={src}
      sizes={sizes}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 