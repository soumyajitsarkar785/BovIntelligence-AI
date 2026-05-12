
'use client';

import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase configuration placeholder - normally populated by Firebase Studio
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "breed-classifier.firebaseapp.com",
  projectId: "breed-classifier",
  storageBucket: "breed-classifier.appspot.com",
  messagingSenderId: "12345",
  appId: "1:12345:web:67890"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface ScanEntry {
  id: string;
  timestamp: any;
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

export function saveScan(entry: Omit<ScanEntry, 'timestamp'>) {
  const colRef = collection(db, 'scans');
  addDoc(colRef, {
    ...entry,
    timestamp: serverTimestamp(),
  }).catch(err => console.error("Firestore Save Error:", err));
}

export function subscribeToHistory(callback: (history: ScanEntry[]) => void) {
  const q = query(collection(db, 'scans'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      // Handle potential null timestamp during local update
      timestamp: doc.data().timestamp?.toMillis() || Date.now()
    })) as ScanEntry[];
    callback(data);
  });
}

export async function deleteScan(id: string) {
  const docRef = doc(db, 'scans', id);
  await deleteDoc(docRef);
}
