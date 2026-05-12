
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  LayoutDashboard, 
  History as HistoryIcon,
  Bell,
  ArrowLeft,
  Activity,
  Cpu,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Info
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScanLedger } from '@/components/ScanLedger';
import { AnalysisView } from '@/components/AnalysisView';
import { ScanOverlay } from '@/components/ScanOverlay';

import { analyzeBovine } from '@/ai/flows/bovine-master-flow';
import { saveScan, ScanEntry, deleteScan, subscribeToHistory, findCachedScan } from '@/lib/storage';

const AppLogo = () => (
  <div className="flex items-center gap-2">
    <div className="h-9 w-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
      <Fingerprint className="h-6 w-6 text-white" />
    </div>
    <div className="flex flex-col">
      <span className="font-headline font-bold text-lg text-[#0F172A] leading-none">BovIntelligence</span>
      <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mt-0.5">AI Platform</span>
    </div>
  </div>
);

export default function BreedClassifierApp() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'ledger'>('home');

  useEffect(() => {
    const unsubscribe = subscribeToHistory((data) => {
      setHistory(data);
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPhoto(dataUri);
        setResult(null);
        processImage(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (dataUri: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // SMART CACHE (Learning Mechanism)
    // Check if this image was scanned before to save API Quota
    const cachedResult = findCachedScan(dataUri);
    if (cachedResult) {
      setLoadingStep('Retrieving learned data...');
      setScanProgress(50);
      setTimeout(() => {
        setScanProgress(100);
        setResult(cachedResult);
        setIsScanning(false);
        toast({ title: "Instant Match", description: "Result retrieved from BovIntelligence memory." });
      }, 1000);
      return;
    }

    try {
      setLoadingStep('Morphological Validation...');
      setScanProgress(20);
      
      const analysis = await analyzeBovine({ photoDataUri: dataUri });
      
      if (analysis.detected_status === "ERROR") {
        toast({
          title: "Diagnostic Failure",
          description: analysis.diagnostic_note || "Insufficient visual data for professional diagnosis.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setScanProgress(70);
      setLoadingStep('Genomic Analysis...');

      const entry: Omit<ScanEntry, 'timestamp'> = {
        id: `BI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        photoDataUri: dataUri,
        breedName: analysis.primary_breed,
        confidence: analysis.confidence_score,
        speciesType: analysis.species_type,
        detectedStatus: analysis.detected_status,
        physiologicalAnalysis: analysis.physiological_analysis,
        visualMarkers: analysis.visual_evidence_markers || [],
        negativeConstraints: analysis.negative_constraints_check,
        diagnosticNote: analysis.diagnostic_note,
        traits: analysis.traits,
        careGuide: analysis.careGuide
      };

      setTimeout(() => {
        setScanProgress(100);
        saveScan(entry);
        setResult({ ...entry, timestamp: Date.now() });
        setIsScanning(false);
        toast({ title: "Analysis Complete", description: "Record secured in BovIntelligence memory." });
      }, 800);

    } catch (error: any) {
      const isQuotaError = error.message?.includes('429') || error.status === 429 || error.message?.includes('quota');
      
      toast({
        title: isQuotaError ? "AI Limit Reached" : "Diagnostic Error",
        description: isQuotaError 
          ? "System quota busy. Please wait 60s or try a previously scanned image." 
          : "An error occurred during analysis.",
        variant: isQuotaError ? "default" : "destructive"
      });
      setIsScanning(false);
      setPhoto(null);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteScan(id);
    if (result?.id === id) {
      setResult(null);
      setPhoto(null);
    }
    toast({ title: "Record Purged", description: "Data removed from memory." });
  };

  return (
    <div className="min-h-screen flex flex-col font-body max-w-md mx-auto shadow-2xl relative bg-transparent pb-24">
      <Toaster />
      
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 print:hidden">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={() => {setPhoto(null); setResult(null);}} className="rounded-full bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        ) : <AppLogo />}
        <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 relative">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-accent rounded-full border border-white"></span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {isScanning ? (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-12">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              {photo && <Image src={photo} alt="Scanning" fill className="object-cover brightness-50" />}
              <ScanOverlay />
              <div className="scan-line" />
            </div>
            <div className="w-full text-center space-y-4">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest animate-pulse">{loadingStep}</p>
              <div className="px-12">
                <Progress value={scanProgress} className="h-1.5 bg-slate-200" />
              </div>
            </div>
          </div>
        ) : result ? (
          <AnalysisView result={result} />
        ) : activeTab === 'ledger' ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-5">
            <div className="px-2">
              <h2 className="text-2xl font-headline font-bold">Genomic Vault</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{history.length} Professional Records</p>
            </div>
            <ScanLedger history={history} onSelect={(e) => {setPhoto(e.photoDataUri); setResult(e);}} onDelete={handleDeleteEntry} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in">
            <div className="px-2 space-y-4">
              <h1 className="text-3xl font-headline font-bold text-[#0F172A]">
                BovIntelligence <span className="text-accent">AI</span>
              </h1>
              
              <Card className="p-5 rounded-[2rem] bg-[#0F172A] text-white border-none shadow-xl flex justify-between items-center overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
                   <Info className="h-24 w-24 text-white" />
                </div>
                <div className="space-y-1 z-10">
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">System Readiness</p>
                  <p className="text-lg font-bold">Diagnostics Active</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center z-10">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
              </Card>
            </div>

            <div className="px-2 grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm flex flex-col items-center text-center transition-transform active:scale-95">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <Cpu className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-bold text-[9px] uppercase tracking-wider">Vision Intelligence</h4>
              </div>
              <div onClick={() => setActiveTab('ledger')} className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm flex flex-col items-center text-center cursor-pointer transition-transform active:scale-95">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-bold text-[9px] uppercase tracking-wider">Memory Bank</h4>
              </div>
            </div>

            {history.length > 0 && (
              <div className="space-y-4 px-2 pb-6">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Analysis</h3>
                    <Button variant="link" onClick={() => setActiveTab('ledger')} className="text-accent font-bold text-[9px] uppercase p-0">
                      View Bank <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div key={scan.id} onClick={() => { setPhoto(scan.photoDataUri); setResult(scan); }} className="min-w-[140px] aspect-[3/4] rounded-[2.5rem] overflow-hidden relative shadow-lg group cursor-pointer">
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-[10px] font-bold text-white truncate">{scan.breedName}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-2xl border-t border-slate-100 h-20 px-12 flex items-center justify-between z-50 rounded-t-[2.5rem] print:hidden">
        <Button variant="ghost" onClick={() => { setActiveTab('home'); setPhoto(null); setResult(null); }} className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'home' ? 'text-accent' : 'text-slate-300'}`}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[8px] font-bold uppercase">Home</span>
        </Button>
        
        <div className="relative -top-8">
          <Button onClick={() => fileInputRef.current?.click()} className="h-15 w-15 rounded-full bg-accent hover:bg-accent/90 shadow-2xl text-white ring-8 ring-white transition-all active:scale-90">
            <Camera className="h-7 w-7" />
          </Button>
        </div>

        <Button variant="ghost" onClick={() => setActiveTab('ledger')} className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'ledger' ? 'text-accent' : 'text-slate-300'}`}>
          <HistoryIcon className="h-5 w-5" />
          <span className="text-[8px] font-bold uppercase">Bank</span>
        </Button>
      </nav>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
    </div>
  );
}
