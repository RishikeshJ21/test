/**
 * Utilities for memory management and garbage collection optimization
 */

/**
 * Triggers a manual garbage collection hint when memory usage is high
 * This can help reduce jank from automatic GC during animations or critical user interactions
 */
export const triggerGarbageCollection = (threshold = 50) => {
  // Only run in browsers that support performance.memory API
  if (!window.performance || !(window.performance as any).memory) return;

  const memory = (window.performance as any).memory;
  if (!memory) return;

  // If we're using more than threshold% of heap, trigger cleanup
  const usedHeapPercentage =
    (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

  if (usedHeapPercentage > threshold) {
    // Create and release large arrays to force garbage collection
    setTimeout(() => {
      try {
        const arr = new Array(1000000);
        for (let i = 0; i < 1000000; i++) {
          arr[i] = i;
        }
        arr.length = 0;
      } catch (e) {
        // Silently fail if out of memory
      }
    }, 100);
  }
};

/**
 * Optimizes memory usage by cleaning up event listeners, timers, and references
 * Call this when unmounting large components
 */
export const cleanupResources = (
  eventTargets: Array<{
    target: EventTarget;
    event: string;
    handler: EventListener;
  }> = [],
  timeouts: number[] = [],
  intervals: number[] = [],
  refs: Array<{ current: any }> = []
) => {
  // Clean up event listeners
  eventTargets.forEach(({ target, event, handler }) => {
    target.removeEventListener(event, handler);
  });

  // Clear timeouts
  timeouts.forEach((id) => {
    window.clearTimeout(id);
  });

  // Clear intervals
  intervals.forEach((id) => {
    window.clearInterval(id);
  });

  // Clean up refs
  refs.forEach((ref) => {
    ref.current = null;
  });
};

/**
 * Defers non-critical operations to idle periods
 */
export const runWhenIdle = (callback: () => void, timeout = 2000) => {
  if ("requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1);
  }
};

/**
 * Cancels a previously scheduled idle callback
 */
export const cancelIdleCallback = (id: number) => {
  if ("cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};
