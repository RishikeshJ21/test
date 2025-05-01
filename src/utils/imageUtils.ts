/**
 * Utilities for image optimization and responsive loading
 */

/**
 * Creates responsive image URLs with optimal sizing and quality parameters
 */
export const getResponsiveImageUrl = (
  url: string,
  width = 0,
  devicePixelRatio = 1
) => {
  if (!url) return "";

  // Skip already optimized URLs or data URLs
  if (url.startsWith("data:") || url.includes("?w=") || url.includes("&w=")) {
    return url;
  }

  // If URL already contains query parameters
  const hasQuery = url.includes("?");
  const connector = hasQuery ? "&" : "?";

  // For responsive images, add appropriate sizing
  if (width > 0) {
    const targetWidth = Math.round(width * devicePixelRatio);
    return `${url}${connector}w=${targetWidth}&q=${
      devicePixelRatio > 1 ? 75 : 80
    }`;
  }

  return url;
};

/**
 * Generates responsive 'sizes' attribute values for <img> elements
 */
export const getImageSizes = (
  defaultSize: string,
  {
    sm,
    md,
    lg,
    xl,
  }: { sm?: string; md?: string; lg?: string; xl?: string } = {}
) => {
  return [
    xl ? `(min-width: 1280px) ${xl}` : "",
    lg ? `(min-width: 1024px) ${lg}` : "",
    md ? `(min-width: 768px) ${md}` : "",
    sm ? `(min-width: 640px) ${sm}` : "",
    defaultSize,
  ]
    .filter(Boolean)
    .join(", ");
};

/**
 * Preloads critical images before they're needed
 * Use for important hero images, logos, etc.
 */
export const preloadCriticalImage = (src: string, priority = "high") => {
  if (!src || typeof document === "undefined") return;

  // Create link element for preloading
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;

  // Set fetchpriority if supported
  if ("fetchpriority" in link) {
    (link as any).fetchpriority = priority;
  }

  // Add to document head
  document.head.appendChild(link);

  return () => {
    // Cleanup function
    document.head.removeChild(link);
  };
};

/**
 * Estimates image dimensions based on aspect ratios
 */
export const estimateImageDimensions = (
  width?: number | string,
  height?: number | string,
  aspectRatio = 16 / 9
) => {
  const result: { width?: number | string; height?: number | string } = {
    width,
    height,
  };

  // If both dimensions are missing, use default values
  if (width === undefined && height === undefined) {
    return { width: 300, height: 300 / aspectRatio };
  }

  // If width is specified but height is missing
  if (width !== undefined && height === undefined) {
    if (typeof width === "number") {
      result.height = width / aspectRatio;
    }
  }

  // If height is specified but width is missing
  if (height !== undefined && width === undefined) {
    if (typeof height === "number") {
      result.width = height * aspectRatio;
    }
  }

  return result;
};
