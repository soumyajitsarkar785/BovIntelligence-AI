
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  LayoutDashboard, 
  Zap, 
  History as HistoryIcon,
  Bell,
  Settings,
  ArrowLeft,
  Search,
  Plus,
  Info,
  Activity,
  ShieldCheck,
  Database,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScanLedger } from '@/components/ScanLedger';
import { AnalysisView } from '@/components/AnalysisView';
import { ScanOverlay } from '@/components/ScanOverlay';
import { Card } from '@/components/ui/card';

import { analyzeBovine, BovineMasterOutput } from '@/ai/flows/bovine-master-flow';
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
  const [activeTab, setActiveTab] = useState<'home' | 'ledger' | 'settings'>('home');
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
      setLoadingStep('Accessing Bovine Neural Core...');
      setScanProgress(15);
      
      const analysis = await analyzeBovine({ photoDataUri: dataUri });
      
      if (!analysis.isBovine) {
        toast({
          title: "Detection Failed",
          description: "No bovine signature detected. Please use a clear photo of a cow or buffalo.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setScanProgress(60);
      setLoadingStep('Synthesizing Genomic Data...');

      const entry: ScanEntry = {
        id: `BX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: Date.now(),
        photoDataUri: dataUri,
        breedName: analysis.breedName,
        confidence: analysis.confidence,
        traits: analysis.traits,
        careGuide: analysis.careGuide
      };

      setTimeout(() => {
        setScanProgress(100);
        setResult(entry);
        saveScan(entry);
        setHistory(getHistory());
        setIsScanning(false);
        setLoadingStep('');
      }, 1000);

    } catch (error: any) {
      console.error(error);
      const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');
      
      toast({
        title: isQuotaError ? "AI Quota Reached" : "System Anomaly",
        description: isQuotaError 
          ? "The Free AI Tier is congested. Please wait 60 seconds before re-initiating the scan." 
          : "An unexpected error occurred in the neural network.",
        variant: "destructive"
      });
      setIsScanning(false);
      setPhoto(null);
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body max-w-md mx-auto shadow-2xl relative overflow-hidden pb-28">
      <Toaster />
      
      {/* Mobile-Native Top Header */}
      <header className="h-20 px-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-2xl z-50 border-b border-slate-100">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={resetAll} className="rounded-full bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Elite Network</span>
            <span className="font-headline font-bold text-2xl text-[#0F172A] leading-none">Bovindex Pro</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 relative group">
            <Bell className="h-5 w-5 text-slate-500 group-hover:text-accent transition-colors" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white animate-pulse"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 scroll-smooth">
        {isScanning ? (
          <div className="h-[75vh] flex flex-col items-center justify-center space-y-12 px-6">
            <div className="relative w-full aspect-square rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-[6px] border-white">
              {photo && <Image src={photo} alt="Scanning" fill className="object-cover brightness-50 scale-110" />}
              <ScanOverlay />
              <div className="scan-line" />
            </div>
            <div className="w-full space-y-6 text-center">
              <div className="space-y-1">
                <p className="text-xs font-black text-accent uppercase tracking-[0.3em]">{loadingStep}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Synchronizing with Global Bovine Database</p>
              </div>
              <div className="space-y-3">
                <Progress value={scanProgress} className="h-2 bg-slate-200" />
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                  <span>NEURAL INTEGRITY: STABLE</span>
                  <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-full">{scanProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <AnalysisView result={result} />
        ) : activeTab === 'ledger' ? (
          <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-end px-2">
              <div className="space-y-1">
                <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Genomic Vault</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured Herd Intelligence</p>
              </div>
              <Badge variant="outline" className="border-accent/20 text-accent rounded-xl font-black uppercase text-[10px] px-3 py-1 bg-accent/5">
                {history.length} Units
              </Badge>
            </div>
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
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="space-y-1">
                <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Platform Config</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Protocols v4.0</p>
              </div>
            <div className="space-y-4">
              {[
                { label: 'Cloud Synchronisation', icon: Zap, status: 'Active', color: 'text-yellow-500' },
                { label: 'Genomic Engine Update', icon: Info, status: 'v4.2.1', color: 'text-accent' },
                { label: 'Biometric Database', icon: Database, status: '12.8 GB', color: 'text-blue-500' },
                { label: 'Neural Accuracy', icon: Activity, status: '99.8%', color: 'text-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-accent">{item.status}</span>
                </div>
              ))}
            </div>
            <Card className="p-6 rounded-[2.5rem] border-none bg-[#0F172A] text-white shadow-2xl">
               <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Subscription</p>
                    <p className="text-lg font-bold">Enterprise Tier</p>
                  </div>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 rounded-full font-black text-[10px] uppercase">Upgrade</Button>
               </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            {/* System Status Hero - First UI Vibe */}
            <div className="px-2 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Neural Engine v4.0 Active</span>
                </div>
                <h1 className="text-4xl font-headline font-bold text-[#0F172A] leading-[1.1]">
                  Next-Gen <br /><span className="text-accent underline decoration-accent/20 underline-offset-8 italic">Bovine Intelligence</span>
                </h1>
              </div>

              <Card className="p-8 rounded-[3rem] bg-[#0F172A] text-white border-none shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 bg-accent/20 h-40 w-40 rounded-full blur-[80px] group-hover:bg-accent/40 transition-all duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <ShieldCheck className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Fleet Integrity</p>
                      <p className="text-base font-bold">Encrypted Ledger Active</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Identified Units</p>
                      <p className="text-3xl font-bold font-headline">{history.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Avg. Precision</p>
                      <p className="text-3xl font-bold font-headline">99.2%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions - Pro App Style */}
            <div className="px-2">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A]">AI Vision Scan</h4>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tighter">Initiate Breed ID</p>
                </div>
                <div 
                  onClick={() => setActiveTab('ledger')}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/10 transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Manual Entry</h4>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tighter">Log Herd Data</p>
                </div>
              </div>
            </div>

            {/* Recent Assets - Horizontal Scroll */}
            {history.length > 0 && (
              <div className="space-y-5 px-2">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-[0.2em]">Neural Archives</h3>
                    <Button variant="link" onClick={() => setActiveTab('ledger')} className="text-accent font-black text-[10px] uppercase tracking-widest p-0 flex items-center gap-1">
                      Explore Vault <ArrowRight className="h-3 w-3" />
                    </Button>
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div 
                        key={scan.id} 
                        onClick={() => {
                          setPhoto(scan.photoDataUri);
                          setResult(scan);
                        }}
                        className="min-w-[170px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative border-[3px] border-white shadow-2xl flex-shrink-0 group transition-all active:scale-95 cursor-pointer"
                      >
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-5">
                          <span className="text-[10px] font-black text-white/60 truncate uppercase tracking-[0.1em] mb-1">{scan.id}</span>
                          <span className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">{scan.breedName}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Platform Insights */}
            <div className="px-2">
              <Card className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-slate-400 leading-none">Global Accuracy</h5>
                    <p className="text-sm font-bold text-slate-800">99.8% Precision Rate</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg text-[9px] font-black uppercase">Elite</Badge>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* High-End App Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-3xl border-t border-slate-100 h-28 px-10 flex items-center justify-between z-50 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
        <Button 
          variant="ghost" 
          onClick={() => {
            setActiveTab('home');
            resetAll();
          }}
          className={`flex flex-col gap-1.5 h-auto p-0 rounded-2xl transition-all duration-300 ${activeTab === 'home' ? 'text-accent scale-110' : 'text-slate-300 hover:text-slate-400'}`}
        >
          <LayoutDashboard className="h-7 w-7" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Terminal</span>
        </Button>
        
        <div className="relative -top-12">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-20 w-20 rounded-full bg-accent hover:bg-accent/90 shadow-[0_20px_50px_rgba(251,113,133,0.4)] text-white flex items-center justify-center p-0 ring-[15px] ring-[#F8FAFC] transition-all active:scale-90 active:rotate-90 duration-500 group"
          >
            <Camera className="h-10 w-10 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('ledger')}
          className={`flex flex-col gap-1.5 h-auto p-0 rounded-2xl transition-all duration-300 ${activeTab === 'ledger' ? 'text-accent scale-110' : 'text-slate-300 hover:text-slate-400'}`}
        >
          <HistoryIcon className="h-7 w-7" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Vault</span>
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

