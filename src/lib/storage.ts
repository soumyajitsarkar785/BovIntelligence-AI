
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

const STORAGE_KEY = 'bovindex_pro_ledger_v2';

export function saveScan(entry: ScanEntry) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const updated = [entry, ...history].slice(0, 100); // Increased capacity
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

export function deleteScan(id: string) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
