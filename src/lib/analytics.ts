// Google Analytics 4 utility functions
<<<<<<< HEAD
=======
import config from "../config";

>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
interface WindowWithGA extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

declare const window: WindowWithGA;

<<<<<<< HEAD
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
=======
// Get measurement ID from config
const MEASUREMENT_ID = config.analytics.measurementId;

// Initialize Google Analytics
export const initGA = (measurementId: string = MEASUREMENT_ID): void => {
  if (typeof window === "undefined" || config.analytics.disabled) return;

  try {
    // Check if GA script is already loaded
    if (!window.gtag) {
      // GA is already initialized in index.html, but we'll ensure gtag function exists
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer?.push(args);
      };
    }

    // Reset configuration if needed
    window.gtag("config", measurementId, {
      send_page_view: false, // We'll handle page views manually for SPA
    });
  } catch (error) {
    // Silently handle errors to prevent app crashes if analytics is blocked
    console.debug(
      "Analytics initialization error (likely blocked by browser extension)"
    );
  }
};

// Track page views
export const pageView = (
  url: string,
  measurementId: string = MEASUREMENT_ID
): void => {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    config.analytics.disabled
  )
    return;

  try {
    window.gtag("config", measurementId, {
      page_path: url,
    });
  } catch (error) {
    // Silently handle errors to prevent app crashes if analytics is blocked
    console.debug(
      "Analytics pageview tracking error (likely blocked by browser extension)"
    );
  }
};

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
  action: string;
  category?: string;
  label?: string;
  value?: number;
}): void => {
<<<<<<< HEAD
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}; 
=======
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    config.analytics.disabled
  )
    return;

  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (error) {
    // Silently handle errors to prevent app crashes if analytics is blocked
    console.debug(
      "Analytics event tracking error (likely blocked by browser extension)"
    );
  }
};
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
