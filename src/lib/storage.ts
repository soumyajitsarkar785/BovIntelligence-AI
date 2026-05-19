
'use client';

/**
 * @fileOverview Local Database Ledger for BovIntelligence AI.
 * Implements Smart Caching (Learning) to avoid redundant API calls.
 */

export interface ScanEntry {
  id: string;
  timestamp: number;
  settingsSignature?: string;
  photoDataUri: string;
  breedName: string;
  confidence: string;
  speciesType: string;
  detectedStatus: string;
  physiologicalAnalysis: {
    cranial: string;
    thoracic: string;
    body: string;
  };
  visualMarkers: string[];
  negativeConstraints: string;
  diagnosticNote: string;
  traits: {
    origin: string;
    milkYieldEstimates: string;
    environmentalAdaptability: string;
    temperament: string;
    physicalCharacteristics: string;
    commonUses: string;
  };
  careGuide: {
    nutritionTips: string;
    healthTips: string;
  };
}

const STORAGE_KEY = 'bovintelligence_vault_v1';

/**
 * Returns the current scan history from local storage.
 */
export function getHistory(): ScanEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Vault Access Error:", e);
    return [];
  }
}

/**
 * Smart Lookup: Finds if an image has been scanned before (Learning Mechanism).
 */
export function findCachedScan(photoDataUri: string, settingsSignature?: string): ScanEntry | null {
  const history = getHistory();
  return history.find((entry) => {
    const sameImage = entry.photoDataUri === photoDataUri;
    if (!sameImage) return false;
    return settingsSignature ? entry.settingsSignature === settingsSignature : true;
  }) || null;
}

/**
 * Saves a new scan record to the persistent ledger.
 */
export function saveScan(entry: Omit<ScanEntry, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const newEntry: ScanEntry = {
    ...entry,
    timestamp: Date.now()
  };
  
  const updatedHistory = [newEntry, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  
  window.dispatchEvent(new CustomEvent('vault-update', { detail: updatedHistory }));
}

/**
 * Subscribes to changes in the scan history.
 */
export function subscribeToHistory(callback: (history: ScanEntry[]) => void) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: CustomEvent<ScanEntry[]>) => {
    callback(e.detail || getHistory());
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    callback(getHistory());
  };

  window.addEventListener('vault-update', handleUpdate as EventListener);
  window.addEventListener('storage', handleStorage);

  callback(getHistory());

  return () => {
    window.removeEventListener('vault-update', handleUpdate as EventListener);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Removes a specific record from the ledger.
 */
export async function deleteScan(id: string) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  window.dispatchEvent(new CustomEvent('vault-update', { detail: updatedHistory }));
}
