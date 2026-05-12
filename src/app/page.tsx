'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  LayoutDashboard, 
  Zap, 
  Dna, 
  HeartPulse, 
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Database,
  Search,
  Settings,
  Bell,
  ChevronRight,
  BarChart3,
  Cpu,
  History as HistoryIcon,
  Menu,
  Plus
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  useEffect(() => {
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

      setLoadingStep(`Analyzing ${classification.breedName} Phenotype...`);
      setScanProgress(45);
      
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      setLoadingStep('Syncing Biological Database...');
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
          title: "Analysis Complete",
          description: `Successfully identified: ${classification.breedName}`,
        });
      }, 800);

    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "Failed to communicate with the neural clusters.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteScan(id);
    const newHistory = getHistory();
    setHistory(newHistory);
    if (result?.id === id) {
      setResult(null);
      setPhoto(null);
    }
    toast({ title: "Entry Removed", description: "Archived record deleted successfully." });
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
    setLoadingStep('');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-body pb-20 lg:pb-0">
      <Toaster />
      
      {/* App Header */}
      <header className="h-16 lg:h-20 bg-white border-b sticky top-0 z-[60] px-4 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-accent shadow-lg shadow-accent/10">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-[#0F172A] leading-none">Bovindex <span className="text-accent">Pro</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">AI Breed Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
          </Button>
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <Image src="https://picsum.photos/seed/user1/100/100" alt="Profile" width={40} height={40} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* Main Visualizer Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/50 relative aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              {!photo ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <div className="h-24 w-24 rounded-full bg-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Camera className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline mb-2 text-[#0F172A]">Start New Analysis</h3>
                  <p className="text-slate-400 text-sm max-w-xs mb-8">
                    Upload or take a photo of any cattle breed for instant identification and care insights.
                  </p>
                  <Button className="rounded-2xl h-14 px-10 bg-[#0F172A] hover:bg-slate-800 text-white font-bold gap-3 shadow-xl">
                    <Plus className="h-6 w-6" /> Identify Now
                  </Button>
                </div>
              ) : (
                <div className="h-full relative">
                  <Image
                    src={photo}
                    alt="Neural Feed"
                    fill
                    className={`object-cover transition-all duration-700 ${isScanning ? 'scale-110 brightness-50 blur-[2px]' : ''}`}
                  />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 bg-black/20">
                      <div className="w-full max-w-xs space-y-6 bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20">
                        <div className="flex justify-between items-center text-white mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">{loadingStep}</span>
                          <span className="text-lg font-bold">{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} className="h-2 bg-white/20" />
                        <div className="scan-line !bg-accent" />
                      </div>
                    </div>
                  )}

                  {!isScanning && (
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
                      <Button 
                        onClick={resetAll}
                        variant="secondary" 
                        className="rounded-2xl h-14 px-8 bg-white/90 backdrop-blur-xl hover:bg-white text-[#0F172A] font-bold gap-2 shadow-2xl"
                      >
                        <RefreshCcw className="h-5 w-5" /> Retake
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

            {/* Mobile History View (Only visible on mobile when tab is selected) */}
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

          {/* Details Content Area */}
          <div className="lg:col-span-7">
            {isScanning ? (
              <div className="space-y-8 animate-pulse">
                <Skeleton className="h-12 w-64 rounded-2xl" />
                <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
              </div>
            ) : result ? (
              <AnalysisView result={result} />
            ) : (
              <div className="h-full flex flex-col justify-center space-y-10 py-10 lg:py-0">
                <div className="space-y-6">
                  <Badge className="bg-accent/10 text-accent border-none px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                    AI Ready
                  </Badge>
                  <h2 className="text-5xl lg:text-7xl font-headline font-bold text-[#0F172A] leading-tight">
                    Professional <br />
                    <span className="text-accent">Cattle</span> Intelligence
                  </h2>
                  <p className="text-lg lg:text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
                    Identify breeds instantly, analyze physical markers, and receive expert-level care protocols with our next-gen vision system.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Zap, title: "Vision Engine", desc: "Recognizes 300+ global cattle and buffalo breeds." },
                    { icon: Dna, title: "Marker Analysis", desc: "Detect physical traits and phenotypic characteristics." },
                    { icon: HeartPulse, title: "Care Plans", desc: "Breed-specific nutrition and veterinary guidance." },
                    { icon: ShieldCheck, title: "Vault Security", desc: "End-to-end encrypted storage for your records." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex gap-4 items-center">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0F172A] shrink-0">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#0F172A]">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 px-10 flex items-center justify-between lg:hidden z-[100] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'scan' ? 'text-accent' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </Button>
        <div className="relative -top-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 rounded-full bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/40 text-white flex items-center justify-center p-0"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col gap-1 h-auto py-2 rounded-2xl ${activeTab === 'history' ? 'text-accent' : 'text-slate-400'}`}
        >
          <HistoryIcon className="h-6 w-6" />
          <span className="text-[10px] font-bold">Records</span>
        </Button>
      </div>

      {/* Mobile History View (Sheet-like overlay when history active) */}
      {activeTab === 'history' && (
        <div className="fixed inset-0 bg-[#F1F5F9] z-[110] lg:hidden p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-bold text-[#0F172A]">All Records</h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('scan')} className="rounded-full bg-white">
              <Plus className="h-6 w-6 rotate-45" />
            </Button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl">
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
