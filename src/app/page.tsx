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
  Info
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
      setLoadingStep('Initializing Neural Engine...');
      setScanProgress(20);
      
      const analysis = await analyzeBovine({ photoDataUri: dataUri });
      
      if (!analysis.isBovine) {
        toast({
          title: "Detection Error",
          description: "No bovine signature found in image.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setLoadingStep('Compiling Genomic Report...');
      setScanProgress(70);

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
      }, 800);

    } catch (error: any) {
      console.error(error);
      const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');
      
      toast({
        title: isQuotaError ? "AI Quota Exceeded" : "System Overload",
        description: isQuotaError 
          ? "Please wait 60 seconds and try again." 
          : "AI service encountered a temporary issue.",
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body max-w-md mx-auto shadow-2xl relative overflow-hidden pb-24">
      <Toaster />
      
      {/* Mobile Top Header */}
      <header className="h-20 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-slate-100">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={resetAll} className="rounded-full bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Bovindex Pro</span>
            <span className="font-headline font-bold text-2xl text-[#0F172A]">Intelligence</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 relative">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {isScanning ? (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-10 px-6">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              {photo && <Image src={photo} alt="Scanning" fill className="object-cover brightness-75" />}
              <ScanOverlay />
              <div className="scan-line" />
            </div>
            <div className="w-full space-y-6 text-center">
              <p className="text-sm font-bold text-[#0F172A] animate-pulse uppercase tracking-wider">{loadingStep}</p>
              <div className="space-y-2">
                <Progress value={scanProgress} className="h-2 bg-slate-200" />
                <div className="flex justify-between text-[10px] font-black text-slate-400">
                  <span>ANALYZING GENOME</span>
                  <span className="text-accent">{scanProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <AnalysisView result={result} />
        ) : activeTab === 'ledger' ? (
          <div className="space-y-6 pb-6">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Secure Vault</h2>
              <Badge variant="outline" className="border-accent/20 text-accent rounded-lg font-black uppercase text-[10px]">
                {history.length} Records
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
          <div className="p-6 space-y-6">
            <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Configurations</h2>
            <div className="space-y-4">
              {[
                { label: 'Cloud Synchronisation', icon: Zap, status: 'Active' },
                { label: 'Neural Core Update', icon: Info, status: 'v3.2' },
                { label: 'Offline Database', icon: Settings, status: '4.2GB' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-accent uppercase">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-10">
            <div className="px-2 space-y-2">
              <Badge className="bg-accent/10 text-accent border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                System Ready
              </Badge>
              <h1 className="text-4xl font-headline font-bold text-[#0F172A] leading-tight">
                Scan your <br /><span className="text-accent">Herd</span> with Precision.
              </h1>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full group-hover:bg-accent/30 transition-all"></div>
              <div className="relative premium-card aspect-[4/3] flex flex-col items-center justify-center p-8 border-2 border-white bg-white/80 backdrop-blur-md shadow-2xl">
                <div className="h-24 w-24 rounded-full bg-accent text-white flex items-center justify-center mb-6 shadow-xl shadow-accent/20 group-hover:scale-110 transition-transform">
                  <Camera className="h-12 w-12" />
                </div>
                <p className="font-black text-[#0F172A] uppercase tracking-widest text-sm">Initiate Vision Scan</p>
                <p className="text-[11px] text-slate-400 font-bold mt-2 italic">Supports High-Res Cattle Vision</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm">
                <Search className="h-6 w-6 text-accent mb-3" />
                <h4 className="font-bold text-sm text-[#0F172A]">AI Vision</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Real-time identification</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Plus className="h-6 w-6 text-blue-500 mb-3" />
                <h4 className="font-bold text-sm text-[#0F172A]">Ledger</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Automatic logging</p>
              </div>
            </div>

            {history.length > 0 && (
              <div className="space-y-4 px-2">
                 <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Quick Vault</h3>
                 <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div 
                        key={scan.id} 
                        onClick={() => {
                          setPhoto(scan.photoDataUri);
                          setResult(scan);
                        }}
                        className="min-w-[140px] aspect-[3/4] rounded-[2rem] overflow-hidden relative border-2 border-white shadow-xl flex-shrink-0 group"
                      >
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-[10px] font-black text-white truncate uppercase tracking-widest">{scan.breedName}</span>
                          <span className="text-[8px] text-white/60 font-bold">{new Date(scan.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modern App Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-2xl border-t border-slate-100 h-24 px-10 flex items-center justify-between z-50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <Button 
          variant="ghost" 
          onClick={() => {
            setActiveTab('home');
            resetAll();
          }}
          className={`flex flex-col gap-1.5 h-auto p-0 rounded-2xl transition-all ${activeTab === 'home' ? 'text-accent scale-110' : 'text-slate-300'}`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
        </Button>
        
        <div className="relative -top-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-20 w-20 rounded-full bg-accent hover:bg-accent/90 shadow-[0_20px_40px_rgba(251,113,133,0.3)] text-white flex items-center justify-center p-0 ring-[12px] ring-[#F8FAFC]"
          >
            <Camera className="h-10 w-10" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('ledger')}
          className={`flex flex-col gap-1.5 h-auto p-0 rounded-2xl transition-all ${activeTab === 'ledger' ? 'text-accent scale-110' : 'text-slate-300'}`}
        >
          <HistoryIcon className="h-6 w-6" />
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
