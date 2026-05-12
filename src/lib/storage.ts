
'use client';

export interface ScanEntry {
  id: string;
  timestamp: number;
  photoDataUri: string;
  breedName: string;
  confidence: 'High' | 'Medium' | 'Low';
  traits: {
    origin: string;
    milkYieldEstimates: string;
    environmentalAdaptability: string;
    temperament: string;
    physicalCharacteristics: string;
    commonUses: string;
    specialNotes?: string;
  };
  careGuide: {
    nutritionTips: string;
    healthTips: string;
  };
}

const STORAGE_KEY = 'bovintelligence_vault_v1';

export function saveScan(entry: ScanEntry) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const updated = [entry, ...history].slice(0, 100);
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
