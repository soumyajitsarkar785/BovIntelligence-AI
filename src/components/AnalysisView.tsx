
'use client';

import { ScanEntry } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Save, 
  Dna, 
  Zap, 
  HeartPulse, 
  History as HistoryIcon, 
  Info,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface AnalysisViewProps {
  result: ScanEntry;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `bovindex_${result.breedName.toLowerCase().replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Vision Match: {result.confidence}
            </Badge>
            <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {result.id}</span>
          </div>
          <h2 className="text-6xl font-headline font-bold text-primary tracking-tight leading-[1]">{result.breedName}</h2>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 px-8 border-2 font-bold gap-2 hover:bg-slate-50">
            <Download className="h-5 w-5" /> Export Data
          </Button>
          <Button className="rounded-2xl h-14 px-8 bg-primary shadow-2xl shadow-primary/30 font-bold gap-2">
            <Save className="h-5 w-5" /> Save Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] border shadow-sm h-16 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="summary" className="rounded-2xl px-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg font-bold">Comprehensive Overview</TabsTrigger>
          <TabsTrigger value="traits" className="rounded-2xl px-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg font-bold">Biological Profile</TabsTrigger>
          <TabsTrigger value="care" className="rounded-2xl px-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg font-bold">Management Path</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="premium-card p-10 space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                  <HistoryIcon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold">Origin & Ancestry</h4>
              </div>
              <p className="text-lg leading-relaxed text-slate-500 font-medium">
                {result.traits.origin}
              </p>
            </div>
            
            <div className="premium-card p-10 space-y-6">
              <div className="flex items-center gap-4 text-accent">
                <div className="h-12 w-12 rounded-2xl bg-accent/5 flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold">Performance Metrics</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Utility Grade</span>
                  <span className="font-bold text-slate-900 text-lg">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Efficiency Yield</span>
                  <span className="font-bold text-slate-900 text-lg">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-[3rem] p-12 text-white flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shrink-0 border border-white/20">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-2">
              <h4 className="text-3xl font-bold">Adaptability & Temperament</h4>
              <p className="text-primary-foreground/80 text-xl font-medium line-clamp-2 italic">"{result.traits.temperament}"</p>
            </div>
            <Button variant="secondary" className="bg-white text-primary hover:bg-slate-100 rounded-2xl px-10 h-16 font-bold text-lg shadow-xl">
              Explore Adaptability
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="mt-8">
          <div className="premium-card p-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold flex items-center gap-3 text-primary">
                    <Dna className="h-7 w-7" /> Physical Identifiers
                  </h4>
                  <p className="text-slate-400 font-medium">Core morphological characteristics of the breed.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <p className="font-bold text-xl text-slate-800 leading-relaxed">{result.traits.physicalCharacteristics}</p>
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5">Phenotype Verified</Badge>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold flex items-center gap-3 text-primary">
                    <Sparkles className="h-7 w-7" /> Resilience Markers
                  </h4>
                  <p className="text-slate-400 font-medium">Environmental survival and adaptability stats.</p>
                </div>
                <p className="text-xl leading-relaxed text-slate-500 font-medium">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-amber-100 text-amber-700 h-10 px-6 rounded-2xl border-none font-bold">Climate Proofed</Badge>
                  <Badge className="bg-primary/5 text-primary h-10 px-6 rounded-2xl border-none font-bold">High Tolerance</Badge>
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="p-10 bg-accent/5 rounded-[2.5rem] border-l-[12px] border-accent">
                <h5 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">Analyst Notes</h5>
                <p className="text-2xl font-headline font-bold text-accent italic opacity-80">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="care" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="premium-card p-10 space-y-8 border-t-[12px] border-t-primary">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold">Nutrition Engine</h3>
                <p className="text-slate-400 font-medium">Precision feeding protocols for optimal yield.</p>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 text-xl leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
              </div>
            </Card>
            
            <Card className="premium-card p-10 space-y-8 border-t-[12px] border-t-accent">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold">Health Protocol</h3>
                <p className="text-slate-400 font-medium">Preventative care and vaccination schedule.</p>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 text-xl leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
              </div>
            </Card>
          </div>
          
          <div className="mt-12 p-8 bg-slate-100 rounded-[2.5rem] flex items-center gap-6 border border-slate-200">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Info className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold text-sm">
              <strong>Compliance Notice:</strong> AI profiles are generated from global breed benchmarks. Site-specific veterinary consultation is mandated for clinical application.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
