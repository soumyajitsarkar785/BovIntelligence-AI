
'use client';

import { useState, useEffect } from 'react';

interface Feature {
  id: string;
  name: string;
  top: string;
  left: string;
}

const BOVINE_FEATURES: Feature[] = [
  { id: 'horns', name: 'Horn Conformation', top: '15%', left: '40%' },
  { id: 'coat', name: 'Coat Pattern', top: '50%', left: '60%' },
  { id: 'muzzle', name: 'Muzzle Characteristics', top: '35%', left: '30%' },
  { id: 'dewlap', name: 'Dewlap Development', top: '55%', left: '35%' },
];

export function ScanOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {BOVINE_FEATURES.map((feature) => (
        <div
          key={feature.id}
          className="absolute flex items-center group pointer-events-auto"
          style={{ top: feature.top, left: feature.left }}
        >
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-accent animate-ping absolute" />
            <div className="h-4 w-4 rounded-full bg-accent border-2 border-white shadow-lg relative" />
          </div>
          <div className="ml-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {feature.name}
          </div>
        </div>
      ))}
    </div>
  );
}
