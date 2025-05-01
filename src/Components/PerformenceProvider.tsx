import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PerformanceContextType = {
  isReducedMotion: boolean;
  isPrefersReducedData: boolean;
  connection: 'slow' | 'medium' | 'fast' | unknown;
};

const PerformanceContext = createContext<PerformanceContextType>({
  isReducedMotion: false,
  isPrefersReducedData: false,
  connection: 'unknown',
});

export const usePerformance = () => useContext(PerformanceContext);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PerformanceContextType>({
    isReducedMotion: false,
    isPrefersReducedData: false,
    connection: 'unknown',
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setState(s => ({ ...s, isReducedMotion: prefersReducedMotion.matches }));

    // Check for reduced data preference
    const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)');
    setState(s => ({ ...s, isPrefersReducedData: prefersReducedData.matches }));

    // Check connection speed if available
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      const effectiveType = conn?.effectiveType || 'unknown';
      
      let connectionSpeed: 'slow' | 'medium' | 'fast' | unknown = 'unknown';
      if (effectiveType === '4g') connectionSpeed = 'fast';
      else if (effectiveType === '3g') connectionSpeed = 'medium';
      else if (['2g', 'slow-2g'].includes(effectiveType)) connectionSpeed = 'slow';
      
      setState(s => ({ ...s, connection: connectionSpeed }));

      // Listen for connection changes
      conn?.addEventListener('change', () => {
        const newEffectiveType = conn?.effectiveType || 'unknown';
        let newConnectionSpeed: 'slow' | 'medium' | 'fast' | unknown = 'unknown';
        
        if (newEffectiveType === '4g') newConnectionSpeed = 'fast';
        else if (newEffectiveType === '3g') newConnectionSpeed = 'medium';
        else if (['2g', 'slow-2g'].includes(newEffectiveType)) newConnectionSpeed = 'slow';
        
        setState(s => ({ ...s, connection: newConnectionSpeed }));
      });
    }
  }, []);

  return (
    <PerformanceContext.Provider value={state}>
      {children}
    </PerformanceContext.Provider>
  );
}