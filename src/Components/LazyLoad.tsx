import { lazy, Suspense, ComponentType } from 'react';

// Minimal loading component
const DefaultLoader = () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  LoadingComponent = DefaultLoader
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}