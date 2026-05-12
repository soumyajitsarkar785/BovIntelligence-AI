
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
  Download,
  Save,
  Database,
  Search,
  Settings,
  Bell,
  ChevronRight,
  BarChart3
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
      setLoadingStep('Initializing Vision AI...');
      setScanProgress(15);
      
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Classification Rejected",
          description: "No bovine detected in image. System expects cattle or buffalo.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setLoadingStep(`Analyzing ${classification.breedName} Genomics...`);
      setScanProgress(45);
      
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      setLoadingStep('Finalizing Analytical Report...');
      setScanProgress(85);

      const entry: ScanEntry = {
        id: Math.random().toString(36).substr(2, 9),
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
          title: "Report Generated",
          description: `Successfully analyzed ${classification.breedName} profile.`,
        });
      }, 1000);

    } catch (error) {
      console.error(error);
      toast({
        title: "System Latency",
        description: "Network timeout in AI node. Please verify connection.",
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
    toast({ title: "Record Purged", description: "Entry removed from local ledger." });
  };

  const resetAll = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900 flex flex-col font-body">
      <Toaster />
      
      {/* Sidebar-style Mini Nav for Pro Feel */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-primary hidden xl:flex flex-col items-center py-10 gap-8 z-[60]">
        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-2xl">
            <LayoutDashboard className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-2xl">
            <Database className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-2xl">
            <BarChart3 className="h-6 w-6" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-2xl">
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 xl:ml-20">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="xl:hidden h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">Bovindex Pro</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Agricultural Intelligence Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 items-center gap-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search records..." className="bg-transparent text-sm border-none focus:ring-0 w-40" />
            </div>
            <Button variant="outline" size="icon" className="rounded-full relative border-none bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <Image src="https://picsum.photos/seed/admin/100/100" alt="Avatar" width={40} height={40} />
            </div>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input & Controls */}
            <div className="lg:col-span-4 space-y-8">
              <div className="premium-card overflow-hidden relative group">
                {!photo ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors h-[500px]"
                  >
                    <div className="h-28 w-28 rounded-[2rem] bg-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-inner">
                      <Camera className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-3xl font-headline font-bold mb-3">Initialize Analysis</h2>
                    <p className="text-slate-500 max-w-[240px] mb-8 leading-relaxed">
                      Upload bovine imagery for full biological and nutritional assessment.
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-[260px]">
                      <Button className="h-12 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
                        <Camera className="h-5 w-5" /> Capture Image
                      </Button>
                      <Button variant="outline" className="h-12 rounded-2xl border-2 font-bold">
                        <Upload className="h-5 w-5" /> Import File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[600px] relative">
                    <Image
                      src={photo}
                      alt="Input"
                      fill
                      className={`object-cover transition-all duration-1000 ${isScanning ? 'scale-110 blur-sm brightness-75' : ''}`}
                    />
                    
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-primary/10 backdrop-blur-[2px]">
                        <div className="w-64 space-y-6">
                          <div className="flex justify-between text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>{loadingStep}</span>
                            <span>{scanProgress}%</span>
                          </div>
                          <Progress value={scanProgress} className="h-1.5 bg-white/20" />
                        </div>
                        <div className="scan-line" />
                      </div>
                    )}

                    {!isScanning && (
                      <div className="absolute bottom-6 right-6 flex gap-2">
                        <Button 
                          onClick={resetAll}
                          variant="secondary" 
                          size="icon" 
                          className="rounded-2xl h-12 w-12 glass-panel hover:bg-white transition-all shadow-2xl"
                        >
                          <RefreshCcw className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
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

              <div className="premium-card p-8">
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

            {/* Right Column: Intelligence Output */}
            <div className="lg:col-span-8">
              {!result && !isScanning ? (
                <div className="h-full flex flex-col justify-center space-y-12">
                  <div className="space-y-6">
                    <Badge className="bg-primary/10 text-primary border-none px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                      Status: Ready for Input
                    </Badge>
                    <h2 className="text-7xl font-headline font-bold leading-[1] text-slate-900 tracking-tight">
                      Elevate Your <br />
                      <span className="text-primary italic">Livestock</span> Management
                    </h2>
                    <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                      Bovindex Pro combines Gemini Vision models with agricultural data to provide precise breed profiling and veterinary care paths.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: Zap, title: "Deep Vision", desc: "Proprietary recognition of 200+ bovine species." },
                      { icon: Dna, title: "Genomic Profiling", desc: "Data-driven insights into milk and physical markers." },
                      { icon: HeartPulse, title: "Health Ops", desc: "Customized nutrition protocols based on breed DNA." },
                      { icon: ShieldCheck, title: "Smart Storage", desc: "All records are securely vaulted in your local ledger." },
                    ].map((item, i) => (
                      <div key={i} className="premium-card p-6 flex gap-5 items-center group cursor-pointer border-none bg-white">
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <item.icon className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-0.5">{item.title}</h4>
                          <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto text-slate-200 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : isScanning ? (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-48 rounded-full" />
                    <Skeleton className="h-20 w-3/4 rounded-3xl" />
                    <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
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
