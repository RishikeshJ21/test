import React, { lazy, Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './globals.css';
import './utils/optimizations.css';
import { PerformanceProvider } from './Components/PerformenceProvider';
import { setupLazyLoading } from './utils/imageOptimizer';

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Optimize font loading
const fontStylesheet = document.createElement('link');
fontStylesheet.rel = 'stylesheet';
fontStylesheet.href = '/fonts/font-stylesheet.css';
fontStylesheet.media = 'print';
fontStylesheet.onload = () => {
    fontStylesheet.media = 'all';
};
document.head.appendChild(fontStylesheet);

// Preconnect to critical domains for faster resource loading
function preconnectTo(url: string) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
}

// Set up preconnects before critical resources are requested
['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(preconnectTo);

// Improved loading component with skeleton
const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[rgba(255,255,255,0.42)] to-[#ffffff6d]">
        <div className="relative">
            <img 
                src="/Logotype.svg" 
                alt="Createathon Logo" 
                className="w-28 h-28 mb-8 filter drop-shadow-lg animate-bounce"
                style={{ animationDuration: '2s' }}
            />
            <div className="absolute -inset-2 rounded-full bg-purple-100/50 blur-md -z-10"></div>
        </div>
        

        
        <div className="mt-1 flex items-center space-x-2 text-black">
          Loading......
        </div>
    </div>
);

// Use custom measure to track and improve LCP
function measureLCP() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);

            // You could send this to your analytics service
            // or take action based on the LCP value
        });

        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }
}

// Lazy load the App component with higher priority
const App = lazy(() => import('./App'));

// Enhanced AppWrapper to initialize optimizations after render
const AppWrapper = () => {
    useEffect(() => {
        // Initialize lazy loading
        setupLazyLoading();

        // Measure performance
        measureLCP();

        // Purge unused CSS (in production only)
        if (process.env.NODE_ENV === 'production') {
            setTimeout(() => {
                const unusedCSSObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            // Wait longer before unloading offscreen content
                            setTimeout(() => {
                                (entry.target as HTMLElement).style.contentVisibility = 'auto';
                            }, 1000);
                        } else {
                            (entry.target as HTMLElement).style.contentVisibility = 'visible';
                        }
                    });
                });

                document.querySelectorAll('.offscreen').forEach(el => {
                    unusedCSSObserver.observe(el);
                });
            }, 2000);
        }
    }, []);

    return (
        <PerformanceProvider>
            <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                    <App />
                </Suspense>
            </BrowserRouter>
        </PerformanceProvider>
    );
};

// Render with priority for critical content
ReactDOM.createRoot(document.getElementById('root')!).render(<AppWrapper />);