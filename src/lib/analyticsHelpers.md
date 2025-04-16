# Google Analytics 4 Setup and Reporting Guide

## Overview
This guide explains how to access and interpret the Google Analytics 4 (GA4) data for this application.

## Accessing the Google Analytics Dashboard

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with the Google account that has access to the property
3. Select the Createathon property

## Key Reports and Metrics

### Real-time Overview
- **Path**: Reports > Realtime
- **What you'll see**: Current active users and their interactions in the last 30 minutes
- **Useful for**: Monitoring immediate impact of campaigns or content changes

### Acquisition Overview
- **Path**: Reports > Acquisition > User acquisition
- **What you'll see**: How users are finding your application (direct, organic, social, etc.)
- **Useful for**: Understanding which channels drive the most traffic

### Engagement Metrics
- **Path**: Reports > Engagement > Events
- We're tracking the following custom events:

| Event Name | Category | Description |
|------------|----------|-------------|
| `navigation_click` | NAVIGATION | User clicked on a navigation link |
| `join_telegram_group` | CONVERSION | User clicked the "Join Now For Free" button |
| `get_started_click` | CONVERSION | User clicked the "Get Started" button in the header |

### Creating Custom Reports

1. Go to **Explore** (left sidebar)
2. Click **Create new exploration**
3. Use the **Variables** panel to add dimensions and metrics
4. For conversion tracking:
   - Add `Event name` as a dimension
   - Filter for event names: `join_telegram_group` and `get_started_click`
   - Add `Event count` as a metric

## Custom Dimensions

We're tracking the following custom dimensions:

| Dimension | Description |
|-----------|-------------|
| `page_path` | The current page path (for SPA page views) |
| `event_label` | Additional context for events (e.g., button location) |

## Event Tracking Implementation

The application sends events to GA4 in the following scenarios:

1. **Page Views**: Tracked automatically when the application loads or when navigating to different routes
2. **Navigation Clicks**: When a user clicks on any navigation menu item
3. **Conversion Actions**: When users click on call-to-action buttons

## Tips for Analyzing Data

1. **Segment by Device**: Compare behavior between mobile and desktop users
2. **Analyze User Journeys**: Look at the sequence of pages users visit before conversion
3. **Monitor Engagement Time**: Check which sections keep users engaged the longest
4. **Track Conversion Rate**: Monitor the ratio of conversions to total visitors

## Further Customization

To add more events, use the `useAnalyticsEvent` hook in your component:

```tsx
import { useAnalyticsEvent, EventCategory } from '../lib/useAnalyticsEvent';

function YourComponent() {
  const trackEvent = useAnalyticsEvent();
  
  const handleUserAction = () => {
    trackEvent({
      action: 'your_event_name',
      category: EventCategory.ENGAGEMENT,
      label: 'descriptive label',
      value: 123 // optional numeric value
    });
    
    // Rest of your code
  };
  
  return (
    <button onClick={handleUserAction}>
      Track Me
    </button>
  );
}
``` 