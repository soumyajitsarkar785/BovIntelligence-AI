'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  LayoutDashboard, 
  Zap, 
  Dna, 
  HeartPulse, 
  ShieldCheck,
  RefreshCcw,
  Plus,
  Scan,
  Cpu,
  History as HistoryIcon,
  Bell,
  Search,
  Settings,
  Database,
  User,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScanLedger } from '@/components/ScanLedger';
import { AnalysisView } from '@/components/AnalysisView';
import { ScanOverlay } from '@/components/ScanOverlay';

import { classifyBovineBreed } from '@/ai/flows/classify-bovine-breed';
import { profileBovineTraits } from '@/ai/flows/profile-bovine-traits-flow';
import { generateBovineCareGuide } from '@/ai/flows/generate-bovine-care-guide';
import { getHistory, saveScan, ScanEntry, deleteScan } from '@/lib/storage';

export default function BovindexApp() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'ledger' | 'settings' | 'profile'>('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());
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
    
    try {
      setLoadingStep('Identifying Specimen...');
      setScanProgress(15);
      
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Detection Failed",
          description: "No bovine signature detected. Please use a clear photo.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setLoadingStep(`Analyzing ${classification.breedName}...`);
      setScanProgress(45);
      
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      setLoadingStep('Finalizing Report...');
      setScanProgress(85);

      const entry: ScanEntry = {
        id: `BX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: Date.now(),
        photoDataUri: dataUri,
        breedName: classification.breedName,
        confidence: classification.confidence,
        traits,
        careGuide
      };

      setTimeout(() => {
        setScanProgress(100);
        setResult(entry);
        saveScan(entry);
        setHistory(getHistory());
        setIsScanning(false);
        setLoadingStep('');
      }, 1000);

    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "AI service unreachable.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteScan(id);
    setHistory(getHistory());
    if (result?.id === id) {
      setResult(null);
      setPhoto(null);
    }
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
    setLoadingStep('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <Toaster />
      
      {/* App Header */}
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={resetAll} className="rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-accent" />
            <span className="font-headline font-bold text-xl text-[#0F172A]">Bovindex <span className="text-accent">Pro</span></span>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        {isScanning ? (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 px-6">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              {photo && <Image src={photo} alt="Scanning" fill className="object-cover brightness-50" />}
              <ScanOverlay />
              <div className="scan-line" />
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-slate-800 animate-pulse">{loadingStep}</p>
                <span className="text-lg font-bold text-accent">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-slate-200" />
            </div>
          </div>
        ) : result ? (
          <AnalysisView result={result} />
        ) : activeTab === 'ledger' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold text-[#0F172A]">Herd History</h2>
            <ScanLedger 
              history={history} 
              onSelect={(entry) => {
                setPhoto(entry.photoDataUri);
                setResult(entry);
              }}
              onDelete={handleDeleteEntry}
            />
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-6 flex flex-col items-center justify-center h-[60vh] text-center">
             <Settings className="h-12 w-12 text-slate-300 mb-2" />
             <h2 className="text-xl font-bold text-slate-800">App Settings</h2>
             <p className="text-sm text-slate-500">Configuration panel for AI Core and Cloud Sync.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge className="bg-accent/10 text-accent border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                AI Vision Active
              </Badge>
              <h1 className="text-4xl font-headline font-bold text-[#0F172A] leading-tight">
                Analyze your <br /><span className="text-accent">Herd</span> instantly.
              </h1>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="premium-card aspect-[4/3] flex flex-col items-center justify-center p-8 border-dashed border-2 border-slate-200 bg-white/50 cursor-pointer hover:bg-white transition-all group"
            >
              <div className="h-20 w-20 rounded-full bg-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="h-10 w-10 text-accent" />
              </div>
              <p className="font-bold text-slate-800">Tap to Scan</p>
              <p className="text-xs text-slate-400 mt-1">Upload or take a photo</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <Database className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">300+ Breeds</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Global Database</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">99% Precise</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vision Accuracy</p>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-bold text-[#0F172A]">Quick History</h3>
               {history.length > 0 ? (
                 <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div 
                        key={scan.id} 
                        onClick={() => {
                          setPhoto(scan.photoDataUri);
                          setResult(scan);
                        }}
                        className="min-w-[120px] aspect-square rounded-[1.5rem] overflow-hidden relative border-2 border-white shadow-md flex-shrink-0"
                      >
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="text-[9px] font-bold text-white truncate">{scan.breedName}</span>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-xs text-slate-400 font-medium italic">No recent scans found.</p>
               )}
            </div>
          </div>
        )}
      </main>

      {/* App Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-2xl border-t h-20 px-8 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button 
          variant="ghost" 
          onClick={() => {
            setActiveTab('home');
            resetAll();
          }}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'home' ? 'text-accent' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase">Home</span>
        </Button>
        
        <div className="relative -top-8">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 rounded-full bg-accent hover:bg-accent/90 shadow-[0_15px_40px_rgba(251,113,133,0.4)] text-white flex items-center justify-center p-0 ring-8 ring-white"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('ledger')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'ledger' ? 'text-accent' : 'text-slate-400'}`}
        >
          <HistoryIcon className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase">History</span>
        </Button>
      </nav>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />
    </div>
  );
}
