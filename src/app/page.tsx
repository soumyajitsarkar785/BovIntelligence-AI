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
  Menu,
  Settings,
  Database
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
  const [activeTab, setActiveTab] = useState<'monitor' | 'ledger' | 'settings'>('monitor');
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
      setLoadingStep('Initializing Vision Engine...');
      setScanProgress(15);
      
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Detection Failed",
          description: "No bovine signature detected. Please use a clear photo of cattle or buffalo.",
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

      setLoadingStep('Synthesizing Professional Report...');
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
          title: "Intelligence Ready",
          description: `${classification.breedName} analyzed with ${classification.confidence} confidence.`,
        });
      }, 1000);

    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "Unable to reach AI services. Please check your internet connection.",
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
    toast({ title: "Removed", description: "Analytical record deleted from ledger." });
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
    setLoadingStep('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-body">
      <Toaster />
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0F172A] text-white fixed h-full z-50">
        <div className="p-8 space-y-8 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-headline leading-tight">Bovindex <span className="text-accent">Pro</span></h1>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">v3.5 Intelligence</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Analysis Hub', id: 'monitor' },
              { icon: Database, label: 'Herd Ledger', id: 'ledger' },
              { icon: Settings, label: 'System Config', id: 'settings' },
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full justify-start gap-4 h-14 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-bold">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
             <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20">
                <Image src="https://picsum.photos/seed/pro-user/100/100" alt="User" width={40} height={40} />
             </div>
             <div>
                <p className="text-sm font-bold">Expert Analyst</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Pro Account</p>
             </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72 flex flex-col pb-24 lg:pb-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
             <Cpu className="h-6 w-6 text-accent" />
             <span className="font-headline font-bold text-xl">Bovindex <span className="text-accent">Pro</span></span>
          </div>
          
          <div className="hidden lg:flex relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Query Ledger Metadata..." 
              className="w-full bg-slate-100 border-none h-11 pl-12 pr-4 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100/50 relative">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden lg:block"></div>
            <Badge className="hidden lg:flex bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Neural Core Online
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Analysis Center */}
            <div className="lg:col-span-5 space-y-8">
              <div className="premium-card overflow-hidden relative aspect-square lg:aspect-[4/5] group">
                {!photo ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-all duration-500"
                  >
                    <div className="h-32 w-32 rounded-[2.5rem] bg-accent/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <Scan className="h-16 w-16 text-accent" />
                    </div>
                    <h3 className="text-3xl font-bold font-headline mb-4 text-[#0F172A]">Vision Core</h3>
                    <p className="text-slate-500 text-sm max-w-xs mb-10 leading-relaxed font-medium">
                      Upload high-resolution bovine imagery for phenotypical and genomic trait extraction.
                    </p>
                    <Button className="rounded-2xl h-14 px-10 bg-[#0F172A] hover:bg-slate-800 text-white font-bold gap-3 shadow-2xl shadow-slate-200">
                      <Plus className="h-6 w-6" /> Initialize Session
                    </Button>
                  </div>
                ) : (
                  <div className="h-full relative overflow-hidden bg-slate-900">
                    <Image
                      src={photo}
                      alt="Neural Feed"
                      fill
                      className={`object-cover transition-all duration-1000 ${isScanning ? 'scale-110 brightness-50' : 'scale-100'}`}
                    />
                    
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-8">
                        <div className="w-full max-w-xs space-y-6 bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">AI Processing</span>
                              <h4 className="text-white font-bold text-sm animate-pulse">{loadingStep}</h4>
                            </div>
                            <span className="text-2xl font-bold text-accent">{scanProgress}%</span>
                          </div>
                          <Progress value={scanProgress} className="h-2.5 bg-white/20" />
                        </div>
                        <div className="scan-line !bg-accent" />
                      </div>
                    )}

                    {!isScanning && (
                      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center gap-4">
                        <Button 
                          onClick={resetAll}
                          variant="secondary" 
                          className="rounded-2xl h-14 px-8 bg-white/90 backdrop-blur-xl hover:bg-white text-[#0F172A] font-bold gap-3 shadow-2xl"
                        >
                          <RefreshCcw className="h-5 w-5" /> Flush & Retake
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

              <div className="hidden lg:block">
                 <ScanLedger 
                    history={history} 
                    onSelect={(entry) => {
                      setPhoto(entry.photoDataUri);
                      setResult(entry);
                      setActiveTab('monitor');
                    }}
                    onDelete={handleDeleteEntry}
                  />
              </div>
            </div>

            {/* Insight Display */}
            <div className="lg:col-span-7">
              {isScanning ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-80 rounded-2xl" />
                    <Skeleton className="h-6 w-48 rounded-xl" />
                  </div>
                  <Skeleton className="h-[700px] w-full rounded-[2.5rem]" />
                </div>
              ) : result ? (
                <AnalysisView result={result} />
              ) : (
                <div className="h-full flex flex-col justify-center space-y-12">
                  <div className="space-y-6">
                    <Badge className="bg-accent/10 text-accent border-none px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.4em]">
                      Precision Agriculture
                    </Badge>
                    <h2 className="text-6xl lg:text-8xl font-headline font-bold text-[#0F172A] leading-[1.05] tracking-tight">
                      Bovine <br />
                      <span className="text-accent italic">Intelligence</span> Core
                    </h2>
                    <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
                      Leverage multimodal Gemini 2.5 models to classify breeds, predict traits, and optimize health protocols instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: Zap, title: "Rapid Inference", desc: "Sub-5s classification speed" },
                      { icon: Dna, title: "Genomic Profiling", desc: "Phenotype-to-breed mapping" },
                      { icon: HeartPulse, title: "Veterinary AI", desc: "Pro-grade health protocols" },
                      { icon: ShieldCheck, title: "Immutable Ledger", desc: "Secure local scan history" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex gap-6 items-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0F172A] shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                          <item.icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-[#0F172A]">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t h-20 px-8 flex items-center justify-between lg:hidden z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('monitor')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'monitor' ? 'text-accent' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase">Core</span>
        </Button>
        
        <div className="relative -top-10">
          <Button 
            onClick={() => {
              setActiveTab('monitor');
              fileInputRef.current?.click();
            }}
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
          <span className="text-[10px] font-black uppercase">Vault</span>
        </Button>
      </nav>

      {/* Mobile History Panel */}
      {activeTab === 'ledger' && (
        <div className="fixed inset-0 bg-[#F8FAFC] z-[60] lg:hidden p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Herd Vault</h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('monitor')} className="rounded-full bg-white shadow-md">
              <Plus className="h-6 w-6 rotate-45 text-slate-400" />
            </Button>
          </div>
          <div className="premium-card p-6">
             <ScanLedger 
                history={history} 
                onSelect={(entry) => {
                  setPhoto(entry.photoDataUri);
                  setResult(entry);
                  setActiveTab('monitor');
                }}
                onDelete={handleDeleteEntry}
              />
          </div>
        </div>
      )}
    </div>
  );
}