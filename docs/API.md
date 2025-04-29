# API Documentation

## Components API Reference

### Core Components

#### Navigation Menu
The navigation menu component built using Radix UI's Navigation Menu primitive.

```typescript
import { NavigationMenu } from '@radix-ui/react-navigation-menu';

interface NavigationMenuProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};
```

#### Scroll Area
A custom scrollable container built with Radix UI's Scroll Area.

```typescript
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string | number;
  orientation?: 'vertical' | 'horizontal';
}
```

#### Accordion
An expandable/collapsible content area using Radix UI's Accordion.

```typescript
import { Accordion } from '@radix-ui/react-accordion';

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string;
  className?: string;
}

type AccordionItem = {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
};
```

### Utility Components

#### DatePicker
A customized date picker component built on react-datepicker.

```typescript
import DatePicker from 'react-datepicker';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  className?: string;
}
```

#### LazyImage
An optimized image component with lazy loading.

```typescript
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  effect?: 'blur' | 'opacity' | 'black-and-white';
  className?: string;
}
```

### Hooks

#### useIntersectionObserver
Custom hook for intersection observer functionality.

```typescript
import { useIntersectionObserver } from 'react-intersection-observer';

function useIntersectionObserver(options?: IntersectionObserverInit) {
  // Returns [ref, inView]
}
```

#### useToast
Hook for displaying toast notifications.

```typescript
import { toast } from 'react-toastify';

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number;
}

function useToast() {
  // Returns show(message: string, options?: ToastOptions) function
}
```

## Utility Functions

### Animation Utilities
Functions for Framer Motion animations.

```typescript
// Fade In Animation
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Slide In Animation
export const slideInVariant = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};
```

### Form Utilities
Helper functions for form handling.

```typescript
// Form Validation
export function validateField(value: string, rules: ValidationRule[]): string[] {
  // Returns array of error messages
}

// Form Data Transformation
export function transformFormData<T>(formData: FormData): T {
  // Returns transformed data
}
```

## Configuration

### Environment Variables
Required environment variables for the application:

```typescript
interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_RECAPTCHA_SITE_KEY: string;
  // Add other environment variables
}
```

### Theme Configuration
TailwindCSS theme configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      },
      // Other theme extensions
    }
  }
};
```

## Type Definitions

### Common Types
Frequently used TypeScript types and interfaces:

```typescript
// API Response Type
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Error Type
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination Type
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

## Event Handling

### Custom Events
Documentation for custom events used in the application:

```typescript
// Custom Event Types
interface CustomEventMap {
  'app:loaded': CustomEvent<void>;
  'auth:login': CustomEvent<{ userId: string }>;
  'data:update': CustomEvent<{ type: string; payload: unknown }>;
}

// Event Dispatcher
function dispatchCustomEvent<K extends keyof CustomEventMap>(
  eventName: K,
  detail: CustomEventMap[K]['detail']
): void;
```

## Security

### Authentication
Authentication-related utilities and types:

```typescript
interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  tokenExpiry: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
```

## Error Handling

### Error Boundary
Error boundary component for catching React errors:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

## Testing Utilities

### Test Helpers
Utility functions for testing:

```typescript
// Render Helper
function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
): RenderResult;

// Mock API Helper
function mockApi(path: string, response: unknown, options?: MockOptions): void;
``` 