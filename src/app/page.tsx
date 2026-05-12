
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  LayoutDashboard, 
  Zap, 
  History as HistoryIcon,
  Bell,
  ArrowLeft,
  Plus,
  Activity,
  ShieldCheck,
  Database,
  ArrowRight,
  TrendingUp
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

export default function BovIntelligenceApp() {
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
      setLoadingStep('Initializing Vision...');
      setScanProgress(20);
      
      const analysis = await analyzeBovine({ photoDataUri: dataUri });
      
      if (!analysis.isBovine) {
        toast({
          title: "Invalid Subject",
          description: "Please provide a clear image of a bovine animal.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      setScanProgress(60);
      setLoadingStep('Mapping Genomics...');

      const entry: ScanEntry = {
        id: `BI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
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
      const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');
      toast({
        title: isQuotaError ? "Service Busy" : "Processing Error",
        description: isQuotaError ? "Quota exceeded. Please retry in 60 seconds." : "Operation failed.",
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body max-w-md mx-auto shadow-2xl relative overflow-hidden pb-28">
      <Toaster />
      
      <header className="h-20 px-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-2xl z-50 border-b border-slate-100">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={() => {setPhoto(null); setResult(null);}} className="rounded-full bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Intelligence</span>
            <span className="font-headline font-bold text-2xl text-[#0F172A] leading-none">BovIntelligence</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 relative group">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {isScanning ? (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-12 px-6">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              {photo && <Image src={photo} alt="Processing" fill className="object-cover brightness-50" />}
              <ScanOverlay />
              <div className="scan-line" />
            </div>
            <div className="w-full space-y-4 text-center">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{loadingStep}</p>
              <div className="px-10">
                <Progress value={scanProgress} className="h-1.5 bg-slate-100" />
              </div>
            </div>
          </div>
        ) : result ? (
          <AnalysisView result={result} />
        ) : activeTab === 'ledger' ? (
          <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Ledger</h2>
              <Badge variant="outline" className="text-accent rounded-lg font-bold uppercase text-[10px] px-2 py-0.5 bg-accent/5 border-accent/10">
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
          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-5">
            <h2 className="text-3xl font-headline font-bold text-[#0F172A]">Platform</h2>
            <div className="space-y-3">
              {[
                { label: 'Cloud Sync', icon: Zap, status: 'Connected', color: 'text-yellow-500' },
                { label: 'AI Core v2.5', icon: Activity, status: 'Active', color: 'text-accent' },
                { label: 'Storage', icon: Database, status: 'Secure', color: 'text-blue-500' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-bold text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-10 animate-in fade-in">
            <div className="px-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Vision Online</span>
              </div>
              <h1 className="text-4xl font-headline font-bold text-[#0F172A] leading-tight">
                Advanced <br /><span className="text-accent">Herd Intelligence</span>
              </h1>

              <Card className="p-6 rounded-[2.5rem] bg-[#0F172A] text-white border-none shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-white/40 uppercase">Total Assets</p>
                    <p className="text-2xl font-bold">{history.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-white/40 uppercase">Precision</p>
                    <p className="text-2xl font-bold">99.2%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="px-2 grid grid-cols-2 gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">New Scan</h4>
              </div>
              <div 
                onClick={() => setActiveTab('ledger')}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">Analytics</h4>
              </div>
            </div>

            {history.length > 0 && (
              <div className="space-y-4 px-2">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest">Recent Activity</h3>
                    <Button variant="link" onClick={() => setActiveTab('ledger')} className="text-accent font-bold text-[10px] uppercase p-0 h-auto">
                      View Ledger <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div 
                        key={scan.id} 
                        onClick={() => { setPhoto(scan.photoDataUri); setResult(scan); }}
                        className="min-w-[150px] aspect-[4/5] rounded-[2rem] overflow-hidden relative border-2 border-white shadow-md flex-shrink-0"
                      >
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-xs font-bold text-white truncate">{scan.breedName}</span>
                          <span className="text-[8px] font-bold text-white/50 uppercase">{scan.id}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-3xl border-t border-slate-100 h-24 px-10 flex items-center justify-between z-50 rounded-t-[3rem] shadow-xl">
        <Button 
          variant="ghost" 
          onClick={() => { setActiveTab('home'); setPhoto(null); setResult(null); }}
          className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'home' ? 'text-accent' : 'text-slate-300'}`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[9px] font-bold uppercase">Home</span>
        </Button>
        
        <div className="relative -top-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 rounded-full bg-accent hover:bg-accent/90 shadow-xl text-white flex items-center justify-center p-0 ring-8 ring-[#F8FAFC]"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('ledger')}
          className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'ledger' ? 'text-accent' : 'text-slate-300'}`}
        >
          <HistoryIcon className="h-6 w-6" />
          <span className="text-[9px] font-bold uppercase">Vault</span>
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
