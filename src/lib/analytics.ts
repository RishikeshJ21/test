// Google Analytics 4 utility functions
interface WindowWithGA extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

declare const window: WindowWithGA;

// Initialize Google Analytics
export const initGA = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Check if GA script is already loaded
  if (!window.gtag) {
    // GA is already initialized in index.html, but we'll ensure gtag function exists
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
  
  // Reset configuration if needed
  window.gtag('config', measurementId, {
    send_page_view: false // We'll handle page views manually for SPA
  });
};

// Track page views
export const pageView = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', 'G-KJ6R7GQLGJ', {
    page_path: url
  });
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}; 