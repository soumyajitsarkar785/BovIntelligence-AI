
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  LayoutDashboard, 
  Zap, 
  History as HistoryIcon,
  Bell,
  ArrowLeft,
  Activity,
  Plus,
  ArrowRight,
  TrendingUp,
  Cpu
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
      setLoadingStep('Initializing AI...');
      setScanProgress(20);
      
      const analysis = await analyzeBovine({ photoDataUri: dataUri });
      
      if (!analysis.isBovine) {
        toast({
          title: "Analysis Failed",
          description: "Subject identified as non-bovine.",
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
        title: isQuotaError ? "Quota Limit Reached" : "Processing Error",
        description: isQuotaError ? "Free tier exhausted. Retry in 60s." : "Analysis failed.",
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body max-w-md mx-auto shadow-2xl relative overflow-hidden pb-24">
      <Toaster />
      
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-slate-100">
        {result || photo ? (
          <Button variant="ghost" size="icon" onClick={() => {setPhoto(null); setResult(null);}} className="rounded-full bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        ) : (
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Intelligence</span>
            <span className="font-headline font-bold text-xl text-[#0F172A] leading-none">BovIntelligence</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 relative">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-accent rounded-full border border-white"></span>
        </Button>
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
            <div className="px-2">
              <h2 className="text-2xl font-headline font-bold text-[#0F172A]">Ledger</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{history.length} Records found</p>
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
            <h2 className="text-2xl font-headline font-bold text-[#0F172A]">Platform</h2>
            <div className="space-y-3">
              {[
                { label: 'Cloud Sync', icon: Zap, status: 'Active', color: 'text-yellow-500' },
                { label: 'AI Core v2.5', icon: Cpu, status: 'Stable', color: 'text-accent' },
                { label: 'Vision Protocol', icon: Activity, status: 'Online', color: 'text-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-bold text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in">
            <div className="px-2 space-y-3">
              <h1 className="text-3xl font-headline font-bold text-[#0F172A] leading-tight">
                Advanced <span className="text-accent">Insights</span>
              </h1>
              
              <Card className="p-5 rounded-[2.5rem] bg-[#0F172A] text-white border-none shadow-xl flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Assets</p>
                  <p className="text-xl font-bold">{history.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
              </Card>
            </div>

            <div className="px-2 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <Cpu className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-bold text-xs text-[#0F172A]">Neural Core</h4>
              </div>
              <div onClick={() => setActiveTab('ledger')} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-bold text-xs text-[#0F172A]">Statistics</h4>
              </div>
            </div>

            {history.length > 0 && (
              <div className="space-y-4 px-2">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest">Neural Archives</h3>
                    <Button variant="link" onClick={() => setActiveTab('ledger')} className="text-accent font-bold text-[9px] uppercase p-0 h-auto">
                      View All <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {history.slice(0, 5).map(scan => (
                      <div 
                        key={scan.id} 
                        onClick={() => { setPhoto(scan.photoDataUri); setResult(scan); }}
                        className="min-w-[140px] aspect-[4/5] rounded-[2rem] overflow-hidden relative border border-white shadow-md flex-shrink-0"
                      >
                        <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-xs font-bold text-white truncate">{scan.breedName}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 h-20 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-2xl">
        <Button 
          variant="ghost" 
          onClick={() => { setActiveTab('home'); setPhoto(null); setResult(null); }}
          className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'home' ? 'text-accent' : 'text-slate-300'}`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[8px] font-bold uppercase">Home</span>
        </Button>
        
        <div className="relative -top-8">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-xl text-white flex items-center justify-center p-0 ring-4 ring-white"
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('ledger')}
          className={`flex flex-col gap-1 h-auto p-0 ${activeTab === 'ledger' ? 'text-accent' : 'text-slate-300'}`}
        >
          <HistoryIcon className="h-5 w-5" />
          <span className="text-[8px] font-bold uppercase">Vault</span>
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
