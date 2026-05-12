
'use client';

import { useState, useEffect } from 'react';

interface Feature {
  id: string;
  name: string;
  top: string;
  left: string;
}

const BOVINE_FEATURES: Feature[] = [
  { id: 'horns', name: 'Conformation Analysis', top: '15%', left: '40%' },
  { id: 'coat', name: 'Genetic Patterning', top: '50%', left: '60%' },
  { id: 'muzzle', name: 'Phenotype Markers', top: '35%', left: '30%' },
  { id: 'dewlap', name: 'Environmental Adaptability', top: '55%', left: '35%' },
];

export function ScanOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {BOVINE_FEATURES.map((feature) => (
        <div
          key={feature.id}
          className="absolute flex items-center group pointer-events-auto"
          style={{ top: feature.top, left: feature.left }}
        >
          <div className="relative">
            <div className="h-6 w-6 rounded-full bg-accent/30 animate-ping absolute -inset-1" />
            <div className="h-4 w-4 rounded-full bg-accent border-2 border-white shadow-[0_0_15px_rgba(189,46,46,0.5)] relative" />
          </div>
          <div className="ml-3 px-3 py-1.5 bg-black/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            {feature.name}
          </div>
        </div>
      ))}
    </div>
  );
}
