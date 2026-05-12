'use client';

import { useState, useEffect } from 'react';

interface Point {
  id: number;
  label: string;
  top: string;
  left: string;
}

const ANALYTICAL_POINTS: Point[] = [
  { id: 1, label: 'Conformation Analysis', top: '20%', left: '45%' },
  { id: 2, label: 'Hereditary Pattern', top: '55%', left: '65%' },
  { id: 3, label: 'Phenotype Vector', top: '40%', left: '35%' },
  { id: 4, label: 'Environmental Adaptability', top: '65%', left: '40%' },
  { id: 5, label: 'Yield Potential Score', top: '30%', left: '75%' },
];

export function ScanOverlay() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setActivePoint(ANALYTICAL_POINTS[current].id);
      current = (current + 1) % ANALYTICAL_POINTS.length;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {ANALYTICAL_POINTS.map((point) => (
        <div
          key={point.id}
          className={`absolute flex flex-col items-center transition-all duration-700 ${
            activePoint === point.id ? 'scale-110 opacity-100' : 'scale-75 opacity-20'
          }`}
          style={{ top: point.top, left: point.left }}
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-accent/20 animate-ping absolute -inset-2" />
            <div className={`h-6 w-6 rounded-full bg-accent border-4 border-white shadow-2xl transition-all ${
              activePoint === point.id ? 'scale-125' : ''
            }`} />
          </div>
          {activePoint === point.id && (
            <div className="mt-4 px-4 py-2 glass-panel rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#0a192f] whitespace-nowrap border-accent/20">
              {point.label}
            </div>
          )}
        </div>
      ))}
      
      {/* Simulation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <line x1="0" y1="20%" x2="100%" y2="80%" stroke="white" strokeWidth="1" />
        <line x1="0" y1="80%" x2="100%" y2="20%" stroke="white" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="20%" stroke="white" fill="none" strokeDasharray="10 5" />
      </svg>
    </div>
  );
}