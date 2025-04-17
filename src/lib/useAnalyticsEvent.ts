import { useCallback } from 'react';
import { event } from './analytics';

// A custom hook for tracking events with Google Analytics
export const useAnalyticsEvent = () => {
  const trackEvent = useCallback(({ 
    action, 
    category, 
    label, 
    value 
  }: {
    action: string;
    category?: string;
    label?: string;
    value?: number;
  }) => {
    event({ action, category, label, value });
  }, []);

  return trackEvent;
};

// Predefined event categories
export const EventCategory = {
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  FORM: 'form',
  MEDIA: 'media',
  CONVERSION: 'conversion',
  ERROR: 'error'
} as const; 