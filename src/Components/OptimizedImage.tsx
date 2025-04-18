import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderSrc?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * OptimizedImage component for better performance
 * - Lazy loads images that are not in the viewport
 * - Provides placeholder blur-up effect
 * - Supports WebP format when available
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderSrc,
  priority = false,
  onLoad
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  // Generate a low-quality placeholder if not provided
  const placeholder = placeholderSrc || `${src}?w=20&q=10`;

  // Handle image load complete event
  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  // For priority images, preload them
  useEffect(() => {
    if (priority && src) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      document.head.appendChild(preloadLink);

      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [priority, src]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        position: 'relative',
      }}
    >
      <LazyLoadImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        effect="blur"
        placeholderSrc={placeholder}
        afterLoad={handleLoad}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        wrapperClassName="w-full h-full"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default OptimizedImage;