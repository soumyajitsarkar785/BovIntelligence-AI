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
  Menu
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
      setLoadingStep('Activating Neural Vision...');
      setScanProgress(15);
      
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Analysis Aborted",
          description: "No bovine signature detected. Please provide a clear cattle or buffalo image.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setLoadingStep(`Decoding ${classification.breedName} Genome...`);
      setScanProgress(45);
      
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      setLoadingStep('Compiling Biological Assets...');
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
          title: "System Ready",
          description: `Analysis complete for ${classification.breedName}.`,
        });
      }, 800);

    } catch (error) {
      console.error(error);
      toast({
        title: "Link Interrupted",
        description: "Communication with AI clusters failed.",
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
    toast({ title: "Sector Purged", description: "Entry removed from storage." });
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-body">
      <Toaster />
      
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-24 bg-[#0a192f] hidden xl:flex flex-col items-center py-10 gap-8 z-[60]">
        <div className="h-14 w-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent animate-pulse border border-accent/20">
          <Cpu className="h-7 w-7" />
        </div>
        <div className="flex-1 flex flex-col gap-6 mt-12">
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-accent hover:bg-white/5 h-14 w-14 rounded-2xl transition-all">
            <LayoutDashboard className="h-7 w-7" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-accent hover:bg-white/5 h-14 w-14 rounded-2xl transition-all">
            <Database className="h-7 w-7" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-accent hover:bg-white/5 h-14 w-14 rounded-2xl transition-all">
            <BarChart3 className="h-7 w-7" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-accent hover:bg-white/5 h-14 w-14 rounded-2xl transition-all">
            <HistoryIcon className="h-7 w-7" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white h-14 w-14 rounded-2xl">
          <Settings className="h-7 w-7" />
        </Button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 xl:ml-24">
        <header className="h-20 md:h-24 bg-white/70 backdrop-blur-2xl border-b sticky top-0 z-50 px-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden h-10 w-10 text-slate-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0a192f] border-none text-white w-72">
                <div className="flex flex-col gap-8 py-10">
                  <div className="flex items-center gap-3 px-4">
                    <Cpu className="h-8 w-8 text-accent" />
                    <span className="text-2xl font-bold font-headline">Bovindex <span className="text-accent">Pro</span></span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start gap-4 text-white/60 hover:text-accent hover:bg-white/5 h-14 px-6 rounded-xl">
                      <LayoutDashboard className="h-6 w-6" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start gap-4 text-white/60 hover:text-accent hover:bg-white/5 h-14 px-6 rounded-xl">
                      <Database className="h-6 w-6" /> Database
                    </Button>
                    <Button variant="ghost" className="justify-start gap-4 text-white/60 hover:text-accent hover:bg-white/5 h-14 px-6 rounded-xl">
                      <BarChart3 className="h-6 w-6" /> Statistics
                    </Button>
                    <Button variant="ghost" className="justify-start gap-4 text-white/60 hover:text-accent hover:bg-white/5 h-14 px-6 rounded-xl">
                      <HistoryIcon className="h-6 w-6" /> History
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden sm:flex h-12 w-12 bg-[#0a192f] rounded-xl items-center justify-center text-accent xl:hidden">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold font-headline text-[#0a192f] tracking-tight">Bovindex <span className="text-accent">Pro</span></h1>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Neural Core: Active</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:flex bg-slate-100 rounded-full px-5 py-2.5 items-center gap-3 border border-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Query database..." className="bg-transparent text-sm border-none focus:ring-0 w-48 font-medium" />
            </div>
            <Button variant="outline" size="icon" className="rounded-full relative border-slate-200 bg-white shadow-sm h-10 w-10 md:h-12 md:w-12">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-white shadow-sm"></span>
            </Button>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-[#0a192f] p-0.5 shadow-lg">
               <div className="h-full w-full rounded-[0.5rem] md:rounded-[0.8rem] overflow-hidden">
                 <Image src="https://picsum.photos/seed/manager/100/100" alt="Avatar" width={48} height={48} />
               </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-10 max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* Left Column: Upload & History */}
            <div className="lg:col-span-4 space-y-6 md:space-y-10">
              <div className="premium-card overflow-hidden relative group aspect-[4/5] lg:aspect-auto lg:h-[600px]">
                {!photo ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/50 transition-all h-full"
                  >
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-accent/5 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-all duration-700 shadow-inner border border-accent/10">
                      <Camera className="h-10 w-10 md:h-14 md:w-14 text-accent" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-headline font-bold mb-3 md:mb-4 text-[#0a192f]">Initialize Link</h2>
                    <p className="text-slate-500 text-sm md:text-base max-w-[280px] mb-8 md:mb-10 leading-relaxed font-medium">
                      Transmit high-resolution bovine imagery for neural classification.
                    </p>
                    <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[300px]">
                      <Button className="h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 md:gap-3 font-bold text-base md:text-lg bg-[#0a192f] hover:bg-slate-800 shadow-xl shadow-slate-200">
                        <Camera className="h-5 w-5 md:h-6 md:w-6" /> Take Snapshot
                      </Button>
                      <Button variant="outline" className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-200 font-bold text-base md:text-lg hover:bg-slate-50">
                        <Upload className="h-5 w-5 md:h-6 md:w-6" /> Upload Matrix
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    <Image
                      src={photo}
                      alt="Neural Feed"
                      fill
                      className={`object-cover transition-all duration-1000 ${isScanning ? 'scale-110 blur-[3px] brightness-[0.4]' : ''}`}
                    />
                    
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
                        <div className="w-full max-w-[280px] space-y-6">
                          <div className="flex justify-between text-white text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-md">
                            <span className="animate-pulse">{loadingStep}</span>
                            <span>{scanProgress}%</span>
                          </div>
                          <Progress value={scanProgress} className="h-2 bg-white/10" />
                          <div className="flex justify-center">
                            <Badge className="bg-accent text-white border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                              Processing...
                            </Badge>
                          </div>
                        </div>
                        <div className="scan-line" />
                      </div>
                    )}

                    {!isScanning && (
                      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                        <Button 
                          onClick={resetAll}
                          variant="secondary" 
                          className="rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 glass-panel hover:bg-white transition-all shadow-2xl font-bold gap-2 text-[#0a192f]"
                        >
                          <RefreshCcw className="h-4 w-4 md:h-5 md:w-5" /> Reset Core
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

              <div className="premium-card p-6 md:p-10">
                <ScanLedger 
                  history={history} 
                  onSelect={(entry) => {
                    setPhoto(entry.photoDataUri);
                    setResult(entry);
                  }}
                  onDelete={handleDeleteEntry}
                />
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-8">
              {!result && !isScanning ? (
                <div className="h-full flex flex-col justify-center space-y-10 md:space-y-16 py-6 md:py-12">
                  <div className="space-y-6 md:space-y-8">
                    <Badge className="bg-accent/10 text-accent border-none px-5 py-2 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em]">
                      Status: Link Ready
                    </Badge>
                    <h2 className="text-4xl md:text-8xl font-headline font-bold leading-tight md:leading-[0.95] text-[#0a192f] tracking-tight">
                      Precision <br />
                      <span className="text-accent italic">Bovine</span> Intelligence
                    </h2>
                    <p className="text-lg md:text-2xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                      Bovindex Pro delivers instant breed identification, genomic markers, and custom care protocols powered by Gemini Vision.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    {[
                      { icon: Zap, title: "Neural Vision", desc: "Recognizes 250+ specific global cattle breeds." },
                      { icon: Dna, title: "Genomic Traits", desc: "Decipher milk potential and physical markers." },
                      { icon: HeartPulse, title: "Care Dynamics", desc: "Dynamic nutrition and health paths for breeds." },
                      { icon: ShieldCheck, title: "Secure Ledger", desc: "Encrypted storage for all agricultural assets." },
                    ].map((item, i) => (
                      <div key={i} className="premium-card p-6 md:p-8 flex gap-4 md:gap-6 items-center group cursor-pointer border-none bg-white/60 hover:bg-white transition-all">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-[1.5rem] bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
                          <item.icon className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg md:text-xl mb-1 text-[#0a192f] truncate">{item.title}</h4>
                          <p className="text-xs md:text-sm text-slate-400 font-medium leading-tight">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 ml-auto text-slate-200 group-hover:text-accent transition-colors hidden sm:block" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : isScanning ? (
                <div className="space-y-8 md:space-y-12 animate-pulse">
                  <div className="space-y-6">
                    <Skeleton className="h-6 w-48 md:w-56 rounded-full" />
                    <Skeleton className="h-16 md:h-24 w-full md:w-3/4 rounded-2xl md:rounded-3xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <Skeleton className="h-[200px] md:h-[250px] w-full rounded-2xl md:rounded-[2.5rem]" />
                      <Skeleton className="h-[200px] md:h-[250px] w-full rounded-2xl md:rounded-[2.5rem]" />
                    </div>
                    <Skeleton className="h-12 md:h-16 w-full rounded-2xl md:rounded-3xl" />
                  </div>
                </div>
              ) : (
                <AnalysisView result={result} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
