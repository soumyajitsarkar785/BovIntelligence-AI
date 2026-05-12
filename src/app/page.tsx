
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
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ScanLedger } from '@/components/ScanLedger';
import { ScanOverlay } from '@/components/ScanOverlay';

import { classifyBovineBreed, ClassifyBovineBreedOutput } from '@/ai/flows/classify-bovine-breed';
import { profileBovineTraits, ProfileBovineTraitsOutput } from '@/ai/flows/profile-bovine-traits-flow';
import { generateBovineCareGuide, GenerateBovineCareGuideOutput } from '@/ai/flows/generate-bovine-care-guide';
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
        setPhoto(reader.result as string);
        setResult(null);
        startScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async (dataUri: string) => {
    setIsScanning(true);
    setScanProgress(10);
    
    try {
      // Step 1: Classify
      setScanProgress(30);
      const classification = await classifyBovineBreed({ photoDataUri: dataUri });
      
      if (!classification.isBovine) {
        toast({
          title: "Not a Bovine",
          description: "We couldn't identify a cow or buffalo in this photo.",
          variant: "destructive"
        });
        setIsScanning(false);
        return;
      }

      // Step 2: Traits & Care (Parallel)
      setScanProgress(60);
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

      setScanProgress(100);
      setResult(entry);
      saveScan(entry);
      setHistory(getHistory());
      setActiveTab('summary');
    } catch (error) {
      console.error(error);
      toast({
        title: "Scan Failed",
        description: "An error occurred during AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">Bovindex</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 px-6">
              Connect Herd
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-2xl border-8 border-white group">
              {!photo ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Camera className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-2">Identify a Breed</h3>
                  <p className="text-muted-foreground max-w-xs mb-8">
                    Upload or capture a clear photo of your livestock to get instant AI-powered breed profiles.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" className="gap-2">
                      <Camera className="h-4 w-4" /> Camera
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" /> Gallery
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Image
                    src={photo}
                    alt="Bovine to classify"
                    fill
                    className="object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <div className="w-full max-w-[200px] space-y-4">
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-accent transition-all duration-300 shadow-[0_0_15px_rgba(189,46,46,0.8)]" 
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                        <p className="text-white text-center font-medium animate-pulse text-sm">
                          Analyzing Traits...
                        </p>
                      </div>
                      <div className="absolute inset-0 scan-line" />
                    </div>
                  )}
                  {result && !isScanning && <ScanOverlay />}
                  
                  {result && !isScanning && (
                    <Button 
                      onClick={reset}
                      variant="secondary" 
                      size="icon" 
                      className="absolute bottom-4 right-4 rounded-full h-10 w-10 shadow-lg"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </div>

            <ScanLedger history={history} onSelect={(entry) => {
              setPhoto(entry.photoDataUri);
              setResult(entry);
              setActiveTab('summary');
            }} />
          </div>

          {/* Right Column: Data Area */}
          <div className="lg:col-span-7">
            {!result && !isScanning ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="space-y-4">
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-bold">
                    Agricultural Intelligence
                  </Badge>
                  <h2 className="text-5xl font-headline font-bold leading-tight">
                    Advanced Livestock <span className="text-primary italic">Analytics</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Bovindex combines deep learning computer vision with veterinary data to help farmers and researchers identify breeds and optimize herd health.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Zap, title: "Instant Vision", desc: "Recognizes physical traits from 200+ global breeds." },
                    { icon: Dna, title: "Genetic Profiling", desc: "Estimates milk yield and climatic adaptability." },
                    { icon: HeartPulse, title: "Care Intelligence", desc: "Custom nutrition guides based on life stages." },
                    { icon: ShieldCheck, title: "Verification", desc: "Human-verified confidence scores for every scan." },
                  ].map((item, i) => (
                    <Card key={i} className="border-none bg-white/40 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-4 flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : isScanning ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-primary uppercase tracking-widest">Identified Breed</span>
                      <Badge className={
                        result.confidence === 'High' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' :
                        result.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200' :
                        'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'
                      }>
                        {result.confidence} Confidence
                      </Badge>
                    </div>
                    <h2 className="text-4xl font-headline font-bold text-primary">{result.breedName}</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export Data</Button>
                    <Button variant="default" size="sm" className="bg-primary text-white">Save to Herd</Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-white/50 border w-full justify-start overflow-x-auto h-12 p-1">
                    <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-white">Summary</TabsTrigger>
                    <TabsTrigger value="traits" className="data-[state=active]:bg-primary data-[state=active]:text-white">Trait Profiler</TabsTrigger>
                    <TabsTrigger value="care" className="data-[state=active]:bg-primary data-[state=active]:text-white">Care Guide</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-white border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 p-4 border-b">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent" /> Origin & History
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 text-sm leading-relaxed">
                          {result.traits.origin}
                        </CardContent>
                      </Card>
                      <Card className="bg-white border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 p-4 border-b">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-accent" /> Use & Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 text-sm leading-relaxed">
                          <p className="mb-2"><strong>Primary Use:</strong> {result.traits.commonUses}</p>
                          <p><strong>Yield:</strong> {result.traits.milkYieldEstimates}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <HeartPulse className="h-8 w-8 text-accent" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="font-bold text-accent text-lg mb-1">Health & Temperament</h4>
                        <p className="text-sm text-muted-foreground">{result.traits.temperament}</p>
                      </div>
                      <Button onClick={() => setActiveTab('care')} variant="link" className="text-accent font-bold group">
                        Full Care Guide <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="traits" className="mt-4">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="p-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2 flex items-center gap-2 text-primary">
                              <Dna className="h-4 w-4" /> Biological Markers
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                                <span className="text-muted-foreground">Physical Conformation</span>
                                <span className="font-medium">{result.traits.physicalCharacteristics.split(',')[0]}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                                <span className="text-muted-foreground">Adaptability Index</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">High Efficiency</Badge>
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl text-sm italic border-l-4 border-primary shadow-sm">
                              "{result.traits.specialNotes}"
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2 flex items-center gap-2 text-primary">
                              <RefreshCcw className="h-4 w-4" /> Environmental Tolerance
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {result.traits.environmentalAdaptability}
                            </p>
                            <div className="flex gap-2">
                              {result.traits.environmentalAdaptability.toLowerCase().includes('heat') && <Badge className="bg-orange-100 text-orange-700">Heat Tolerant</Badge>}
                              {result.traits.environmentalAdaptability.toLowerCase().includes('cold') && <Badge className="bg-blue-100 text-blue-700">Cold Hardy</Badge>}
                              <Badge className="bg-green-100 text-green-700">Resilient</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="care" className="mt-4">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white border-none shadow-sm overflow-hidden border-t-4 border-t-primary">
                          <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-lg font-headline font-bold">Nutrition Plan</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                            {result.careGuide.nutritionTips}
                          </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-sm overflow-hidden border-t-4 border-t-accent">
                          <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-lg font-headline font-bold">Management Schedule</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                            {result.careGuide.healthTips}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border border-dashed text-xs text-muted-foreground">
                        <Info className="h-5 w-5 text-primary shrink-0" />
                        <p>This guide is AI-generated based on specific breed characteristics. Always consult with a local veterinarian for site-specific health protocols and vaccine schedules.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            &copy; {new Date().getFullYear()} Bovindex Agricultural Systems. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-primary/60">
            <a href="#" className="hover:text-primary transition-colors">Safety Protocols</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
