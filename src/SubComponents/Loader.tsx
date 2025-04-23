// Keep the loader upto 6 to 8 sec 

import { useState, useEffect } from 'react';

export default function Loader() {
  const [dots, setDots] = useState<string>('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 200); // Change dot every 500ms
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-xl font-medium text-purple-700">
        Loading<span className="inline-block w-12 text-left">{dots}</span>
      </div>
    </div>
  );
} 