
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Info, 
  LayoutDashboard, 
  Zap, 
  Dna, 
  HeartPulse, 
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Download,
  Save,
  ChevronRight,
  Database,
  History as HistoryIcon
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScanLedger } from '@/components/ScanLedger';
import { ScanOverlay } from '@/components/ScanOverlay';

import { classifyBovineBreed } from '@/ai/flows/classify-bovine-breed';
import { profileBovineTraits } from '@/ai/flows/profile-bovine-traits-flow';
import { generateBovineCareGuide } from '@/ai/flows/generate-bovine-care-guide';
import { getHistory, saveScan, ScanEntry } from '@/lib/storage';

export default function BovindexPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [activeTab, setActiveTab] = useState('summary');

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
        startScan(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async (dataUri: string) => {
    setIsScanning(true);
    setScanProgress(5);
    
    try {
      // Phase 1: AI Vision Analysis
      setScanProgress(25);
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Analysis Result",
          description: "This doesn't appear to be a bovine (cow or buffalo). Please try another image.",
          variant: "destructive"
        });
        setIsScanning(false);
        setPhoto(null);
        return;
      }

      // Phase 2: Deep Data Retrieval (Parallel)
      setScanProgress(55);
      const [traits, careGuide] = await Promise.all([
        profileBovineTraits({ breedName: classification.breedName }),
        generateBovineCareGuide({ breedName: classification.breedName, lifeStage: 'adult' })
      ]);

      const entry: ScanEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        photoDataUri: dataUri,
        breedName: classification.breedName,
        confidence: classification.confidence,
        traits,
        careGuide
      };

      setScanProgress(90);
      
      // Artificial delay for smooth UX
      setTimeout(() => {
        setScanProgress(100);
        setResult(entry);
        saveScan(entry);
        setHistory(getHistory());
        setActiveTab('summary');
        setIsScanning(false);
        toast({
          title: "Scan Complete",
          description: `Identified as: ${classification.breedName}`,
        });
      }, 800);

    } catch (error) {
      console.error(error);
      toast({
        title: "System Error",
        description: "AI analysis server is busy. Please try again in a moment.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `bovindex_${result.breedName.toLowerCase().replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({
      title: "Export Success",
      description: "Data exported as JSON successfully.",
    });
  };

  const handleConnectHerd = () => {
    toast({
      title: "Cloud Sync",
      description: "Connecting to your central herd database...",
    });
  };

  const handleSaveToHerd = () => {
    toast({
      title: "Record Saved",
      description: `${result?.breedName} has been added to your local records.`,
    });
  };

  const resetScanner = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-foreground flex flex-col font-body selection:bg-primary/20">
      <Toaster />
      
      {/* Premium Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary leading-none">Bovindex</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pro Agricultural AI</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2">
              <Database className="h-4 w-4" /> Records
            </button>
          </div>

          <Button onClick={handleConnectHerd} size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 shadow-md">
            Connect Cloud
          </Button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Imaging Interface */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white group">
              {!photo ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-primary/5 transition-all duration-500"
                >
                  <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Camera className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold mb-4">Start Identification</h2>
                  <p className="text-muted-foreground max-w-xs mb-10 leading-relaxed">
                    Upload a high-resolution photo of your livestock for instant genetic and care profiling.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button variant="default" className="flex-1 h-12 rounded-xl gap-2 text-md shadow-lg">
                      <Camera className="h-5 w-5" /> Take Photo
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 text-md border-2">
                      <Upload className="h-5 w-5" /> Browse
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full relative">
                  <Image
                    src={photo}
                    alt="Scan target"
                    fill
                    className={`object-cover transition-all duration-700 ${isScanning ? 'brightness-50 grayscale-[0.5]' : ''}`}
                  />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <div className="w-64 space-y-6">
                        <div className="flex justify-between text-white text-xs font-bold uppercase tracking-widest mb-2">
                          <span>Processing</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} className="h-2 bg-white/20" />
                        <p className="text-white text-center font-bold animate-pulse text-sm tracking-wide">
                          Neural Analysis in Progress...
                        </p>
                      </div>
                      <div className="absolute inset-0 scan-line" />
                    </div>
                  )}

                  {result && !isScanning && <ScanOverlay />}
                  
                  {photo && !isScanning && (
                    <Button 
                      onClick={resetScanner}
                      variant="secondary" 
                      size="icon" 
                      className="absolute bottom-6 right-6 rounded-2xl h-12 w-12 shadow-2xl bg-white/90 backdrop-blur hover:bg-white"
                    >
                      <RefreshCcw className="h-5 w-5" />
                    </Button>
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

            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <ScanLedger history={history} onSelect={(entry) => {
                setPhoto(entry.photoDataUri);
                setResult(entry);
                setActiveTab('summary');
              }} />
            </div>
          </div>

          {/* Right: Intelligence Output */}
          <div className="lg:col-span-7">
            {!result && !isScanning ? (
              <div className="h-full flex flex-col justify-center space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="space-y-6">
                  <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    Next-Gen Agri-Tech
                  </Badge>
                  <h2 className="text-6xl font-headline font-bold leading-[1.1] text-slate-900">
                    The Smartest Way to Manage Your <span className="text-primary italic">Herd</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    Utilizing Gemini Vision Pro, Bovindex provides instant breed identification, genetic trait estimates, and professional veterinary-grade care guides.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { icon: Zap, title: "Vision AI", desc: "Recognizes 200+ global cattle and buffalo breeds." },
                    { icon: Dna, title: "Genetic Insights", desc: "Estimates milk yield and climate resilience markers." },
                    { icon: HeartPulse, title: "Custom Care", desc: "Tailored nutrition and health management guides." },
                    { icon: ShieldCheck, title: "Verified Data", desc: "Confidence scores for research-level accuracy." },
                  ].map((item, i) => (
                    <div key={i} className="group p-5 bg-white rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : isScanning ? (
              <div className="space-y-10 animate-pulse">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-40 rounded-full" />
                  <Skeleton className="h-16 w-3/4 rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Verified Identity</span>
                      <Badge className={
                        result.confidence === 'High' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100' :
                        result.confidence === 'Medium' ? 'bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100' :
                        'bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-100'
                      }>
                        {result.confidence} Confidence
                      </Badge>
                    </div>
                    <h2 className="text-5xl font-headline font-bold text-primary tracking-tight">{result.breedName}</h2>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleExport} variant="outline" size="lg" className="rounded-xl border-2 hover:bg-muted font-bold gap-2">
                      <Download className="h-5 w-5" /> Export
                    </Button>
                    <Button onClick={handleSaveToHerd} size="lg" className="rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold gap-2">
                      <Save className="h-5 w-5" /> Save Record
                    </Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-white p-1.5 rounded-2xl border shadow-sm w-full md:w-auto h-14 mb-8">
                    <TabsTrigger value="summary" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Overview</TabsTrigger>
                    <TabsTrigger value="traits" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Biological Profile</TabsTrigger>
                    <TabsTrigger value="care" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Care & Health</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="rounded-[2rem] border-none bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="bg-primary/5 p-6 border-b border-primary/5">
                          <CardTitle className="text-md font-bold flex items-center gap-3 text-primary">
                            <HistoryIcon className="h-5 w-5" /> Historical Context
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 text-md leading-relaxed text-muted-foreground">
                          {result.traits.origin}
                        </CardContent>
                      </Card>
                      
                      <Card className="rounded-[2rem] border-none bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="bg-accent/5 p-6 border-b border-accent/5">
                          <CardTitle className="text-md font-bold flex items-center gap-3 text-accent">
                            <Zap className="h-5 w-5" /> Economic Utility
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground font-medium">Primary Use</span>
                            <span className="font-bold text-slate-800">{result.traits.commonUses}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground font-medium">Expected Yield</span>
                            <span className="font-bold text-slate-800">{result.traits.milkYieldEstimates}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/20">
                      <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                        <HeartPulse className="h-10 w-10" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl font-bold mb-2">Health & Temperament</h4>
                        <p className="text-primary-foreground/90 text-lg line-clamp-2">{result.traits.temperament}</p>
                      </div>
                      <Button onClick={() => setActiveTab('care')} variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 h-12 font-bold shadow-lg">
                        View Full Care Plan
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="traits" className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h4 className="text-xl font-bold flex items-center gap-3 text-primary pb-4 border-b">
                            <Dna className="h-6 w-6" /> Physical Markers
                          </h4>
                          <div className="space-y-5">
                            <div className="p-5 bg-muted/30 rounded-2xl">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Breed Characteristics</span>
                              <p className="font-semibold text-lg">{result.traits.physicalCharacteristics}</p>
                            </div>
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">Efficiency Rating</span>
                              <p className="font-bold text-emerald-900 text-lg">Optimized for Productivity</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-xl font-bold flex items-center gap-3 text-primary pb-4 border-b">
                            <Sparkles className="h-6 w-6" /> Adaptability Profile
                          </h4>
                          <p className="text-lg leading-relaxed text-muted-foreground">
                            {result.traits.environmentalAdaptability}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {result.traits.environmentalAdaptability.toLowerCase().includes('heat') && <Badge className="bg-orange-100 text-orange-700 py-2 px-4 rounded-xl border-none font-bold">Heat Resistant</Badge>}
                            {result.traits.environmentalAdaptability.toLowerCase().includes('cold') && <Badge className="bg-blue-100 text-blue-700 py-2 px-4 rounded-xl border-none font-bold">Cold Tolerant</Badge>}
                            <Badge className="bg-primary/10 text-primary py-2 px-4 rounded-xl border-none font-bold">Climate Ready</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-primary/5 rounded-[2rem] border-l-[8px] border-primary italic text-xl text-primary/80">
                        "{result.traits.specialNotes}"
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="care" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="rounded-[2.5rem] border-none bg-white shadow-xl overflow-hidden border-t-8 border-t-primary">
                        <CardHeader className="p-8 pb-4">
                          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <Zap className="h-7 w-7 text-primary" />
                          </div>
                          <CardTitle className="text-2xl font-headline font-bold">Nutrition Management</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 prose prose-slate max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                          {result.careGuide.nutritionTips}
                        </CardContent>
                      </Card>
                      
                      <Card className="rounded-[2.5rem] border-none bg-white shadow-xl overflow-hidden border-t-8 border-t-accent">
                        <CardHeader className="p-8 pb-4">
                          <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                            <HeartPulse className="h-7 w-7 text-accent" />
                          </div>
                          <CardTitle className="text-2xl font-headline font-bold">Health Protocol</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 prose prose-slate max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                          {result.careGuide.healthTips}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex items-center gap-5 p-8 bg-amber-50 rounded-[2rem] border border-amber-200 shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Info className="h-6 w-6 text-amber-700" />
                      </div>
                      <p className="text-amber-900 font-medium">
                        <strong>Disclaimer:</strong> This care guide is AI-generated based on breed profiles. Please consult your local veterinarian for custom vaccination schedules and site-specific health advice.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-20 border-t py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-headline font-bold text-primary">Bovindex</span>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium">
              &copy; {new Date().getFullYear()} Bovindex Agri-Intelligence Systems. All rights reserved.
            </p>
            
            <div className="flex gap-8">
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Safety</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
