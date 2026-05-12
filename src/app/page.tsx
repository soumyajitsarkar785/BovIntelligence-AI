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
  Bell
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

export default function BovindexPro() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'profile'>('scan');
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
      setLoadingStep('Initializing Neural Engine...');
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

      setLoadingStep(`Analyzing ${classification.breedName} Genome...`);
      setScanProgress(45);
      
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      setLoadingStep('Finalizing Intelligence Report...');
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
        toast({
          title: "Analysis Successful",
          description: `${classification.breedName} identified with ${classification.confidence} confidence.`,
        });
      }, 800);

    } catch (error) {
      console.error(error);
      toast({
        title: "System Error",
        description: "Network timeout. Please check your connection.",
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
    toast({ title: "Archived", description: "Record deleted successfully." });
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
    setLoadingStep('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-body pb-24 lg:pb-0">
      <Toaster />
      
      <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b sticky top-0 z-[60] px-4 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#0F172A] rounded-xl flex items-center justify-center text-accent shadow-lg shadow-accent/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-headline text-[#0F172A] leading-none">Bovindex <span className="text-accent">Pro</span></h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mt-1">v3.0.1 Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-slate-100 hidden sm:flex">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
          </Button>
          <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
            <Image src="https://picsum.photos/seed/user-dev/100/100" alt="User" width={36} height={36} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/50 relative aspect-[4/5] lg:aspect-auto lg:h-[600px] group">
              {!photo ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="h-24 w-24 rounded-full bg-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Scan className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline mb-2 text-[#0F172A]">AI Vision Analysis</h3>
                  <p className="text-slate-400 text-sm max-w-xs mb-8 font-medium">
                    Upload or capture a bovine subject for genomic profiling and care insights.
                  </p>
                  <Button className="rounded-2xl h-14 px-10 bg-[#0F172A] hover:bg-slate-800 text-white font-bold gap-3 shadow-xl">
                    <Plus className="h-6 w-6" /> Start New Scan
                  </Button>
                </div>
              ) : (
                <div className="h-full relative overflow-hidden">
                  <Image
                    src={photo}
                    alt="Bovine Neural Feed"
                    fill
                    className={`object-cover transition-all duration-700 ${isScanning ? 'scale-110 brightness-50 blur-[2px]' : ''}`}
                  />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6">
                      <div className="w-full max-w-xs space-y-4 bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20">
                        <div className="flex justify-between items-center text-white">
                          <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">{loadingStep}</span>
                          <span className="text-lg font-bold">{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} className="h-2 bg-white/20" />
                      </div>
                      <div className="scan-line !bg-accent" />
                    </div>
                  )}

                  {!isScanning && (
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center gap-3">
                      <Button 
                        onClick={resetAll}
                        variant="secondary" 
                        className="rounded-2xl h-12 px-6 bg-white/90 backdrop-blur-xl hover:bg-white text-[#0F172A] font-bold gap-2 shadow-2xl"
                      >
                        <RefreshCcw className="h-4 w-4" /> Retake
                      </Button>
                    </div>
                  )}
                  
                  {isScanning && <ScanOverlay />}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </div>

            <div className="lg:block hidden bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white/50">
               <ScanLedger 
                  history={history} 
                  onSelect={(entry) => {
                    setPhoto(entry.photoDataUri);
                    setResult(entry);
                    setActiveTab('scan');
                  }}
                  onDelete={handleDeleteEntry}
                />
            </div>
          </div>

          <div className="lg:col-span-7">
            {isScanning ? (
              <div className="space-y-8 animate-pulse p-4 lg:p-0">
                <Skeleton className="h-10 w-48 rounded-2xl" />
                <Skeleton className="h-[450px] w-full rounded-[2.5rem]" />
              </div>
            ) : result ? (
              <div className="p-1 lg:p-0">
                <AnalysisView result={result} />
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center space-y-10 py-10 lg:py-0 px-4">
                <div className="space-y-6">
                  <Badge className="bg-accent/10 text-accent border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Ready for analysis
                  </Badge>
                  <h2 className="text-5xl lg:text-7xl font-headline font-bold text-[#0F172A] leading-tight">
                    Professional <br />
                    <span className="text-accent">Cattle</span> Intelligence
                  </h2>
                  <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                    Instantly identify breeds, analyze traits, and receive expert veterinary protocols with our vision engine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Zap, title: "Neural Vision", desc: "Supports 300+ global breeds." },
                    { icon: Dna, title: "Genomic Mapping", desc: "Physical marker detection." },
                    { icon: HeartPulse, title: "Expert Care", desc: "Specific nutrition & health plans." },
                    { icon: ShieldCheck, title: "Secure Ledger", desc: "Private encrypted cloud sync." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md flex gap-4 items-center group hover:bg-slate-50 transition-colors">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0F172A] shrink-0 group-hover:bg-white transition-colors">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#0F172A]">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t h-20 px-8 flex items-center justify-between lg:hidden z-[100] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'scan' ? 'text-accent' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-bold">Monitor</span>
        </Button>
        
        <div className="relative -top-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 rounded-full bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/40 text-white flex items-center justify-center p-0 ring-4 ring-white"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'history' ? 'text-accent' : 'text-slate-400'}`}
        >
          <HistoryIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Ledger</span>
        </Button>
      </div>

      {activeTab === 'history' && (
        <div className="fixed inset-0 bg-[#F8FAFC] z-[110] lg:hidden p-4 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Herd Ledger</h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('scan')} className="rounded-full bg-white shadow-md">
              <Plus className="h-6 w-6 rotate-45" />
            </Button>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
             <ScanLedger 
                history={history} 
                onSelect={(entry) => {
                  setPhoto(entry.photoDataUri);
                  setResult(entry);
                  setActiveTab('scan');
                }}
                onDelete={handleDeleteEntry}
              />
          </div>
        </div>
      )}
    </div>
  );
}
