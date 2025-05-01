/**
 * Image optimization utilities
 */

// Properly size images based on display size and device resolution
export function getOptimalImageSize(
  url: string,
  width: number,
  height?: number,
  quality = 80
): string {
  // If it's an external image URL or SVG (can't resize), return as is
  if (url.startsWith("http") || url.endsWith(".svg")) {
    return url;
  }

  // For local images, we can resize them using query parameters
  // In a real implementation, you'd use an image CDN or server middleware
  const h = height ? `&height=${height}` : "";
  return `${url}?width=${width}${h}&quality=${quality}`;
}

// Lazy load images with a fade-in effect
export function setupLazyLoading(): void {
  if (typeof document === "undefined") return;

  // Use Intersection Observer to detect when images enter viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          // Replace data-src with src to trigger load
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }

          // Add loaded class for animation
          img.addEventListener("load", () => {
            img.classList.add("loaded");
          });

          // Stop observing once loaded
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" } // Start loading when image is 200px from viewport
  );

  // Observe all images with lazy-image class
  document.querySelectorAll("img.lazy-image").forEach((img) => {
    observer.observe(img);
  });
}

// Inline SVG to reduce network requests and for better performance
export function inlineSVG(svgPath: string): Promise<string> {
  return fetch(svgPath)
    .then((response) => response.text())
    .then((svgText) => {
      // Optimize SVG by removing unnecessary attributes
      return svgText
        .replace(/<!--.*?-->/g, "") // Remove comments
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/>\s+</g, "><"); // Remove whitespace between tags
    })
    .catch(() => ""); // Return empty string on error
}

// Initialize lazy loading when DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "complete") {
    setupLazyLoading();
  } else {
    window.addEventListener("load", setupLazyLoading);
  }
}
