/// <reference types="vite/client" />
interface CSSStyleDeclaration {
  contentVisibility: string;
}
// Add service worker types
interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

declare module "vite-plugin-pwa/info" {
  export function useRegisterSW(options?: any): {
    needRefresh: boolean;
    offlineReady: boolean;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
