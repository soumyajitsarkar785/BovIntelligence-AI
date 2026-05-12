
'use client';

export interface ScanEntry {
  id: string;
  timestamp: number;
  photoDataUri: string;
  breedName: string;
  confidence: 'High' | 'Medium' | 'Low';
  traits: any;
  careGuide: any;
}

const STORAGE_KEY = 'bovindex_ledger';

export function saveScan(entry: ScanEntry) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const updated = [entry, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getHistory(): ScanEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
