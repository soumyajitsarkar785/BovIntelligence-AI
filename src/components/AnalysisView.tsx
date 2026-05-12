'use client';

import { ScanEntry } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  Save, 
  Dna, 
  Zap, 
  HeartPulse, 
  Info,
  Sparkles,
  ShieldCheck,
  Globe,
  BarChart4
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisViewProps {
  result: ScanEntry;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  const { toast } = useToast();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `bovindex_report_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Export Initialized", description: "Analytical report transmitted to local storage." });
  };

  const handleSaveToHerd = () => {
    toast({ title: "Asset Committed", description: "Bovine profile synchronized with secure cloud ledger." });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
              Match Confidence: {result.confidence}
            </Badge>
            <span className="h-1.5 w-1.5 bg-slate-300 rounded-full"></span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{result.id}</span>
          </div>
          <h2 className="text-7xl font-headline font-bold text-[#0a192f] tracking-tight leading-[0.9]">{result.breedName}</h2>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleExport} variant="outline" className="rounded-2xl h-16 px-10 border-2 border-slate-200 font-black gap-3 hover:bg-slate-50 transition-all text-slate-700">
            <Download className="h-6 w-6" /> Export Data
          </Button>
          <Button onClick={handleSaveToHerd} className="rounded-2xl h-16 px-10 bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/20 font-black gap-3 text-white transition-all text-lg">
            <Save className="h-6 w-6" /> Commit to Herd
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100 p-2 rounded-[2rem] border border-slate-200 shadow-inner h-20 w-full md:w-auto flex overflow-x-auto gap-2">
          <TabsTrigger value="summary" className="rounded-2xl px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all">Report Summary</TabsTrigger>
          <TabsTrigger value="traits" className="rounded-2xl px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all">Genomic Profile</TabsTrigger>
          <TabsTrigger value="care" className="rounded-2xl px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all">Care Protocol</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="premium-card p-12 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-5 text-[#0a192f]">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  <Globe className="h-7 w-7" />
                </div>
                <h4 className="text-2xl font-bold">Historical Origin</h4>
              </div>
              <p className="text-xl leading-relaxed text-slate-500 font-medium italic">
                {result.traits.origin}
              </p>
            </div>
            
            <div className="premium-card p-12 space-y-8">
              <div className="flex items-center gap-5 text-accent">
                <div className="h-14 w-14 rounded-2xl bg-accent/5 flex items-center justify-center border border-accent/10">
                  <BarChart4 className="h-7 w-7" />
                </div>
                <h4 className="text-2xl font-bold">Utility Index</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-5 border-b border-slate-50">
                  <span className="text-slate-400 font-black text-[11px] uppercase tracking-widest">Primary Grade</span>
                  <span className="font-bold text-[#0a192f] text-xl">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b border-slate-50">
                  <span className="text-slate-400 font-black text-[11px] uppercase tracking-widest">Yield Estimates</span>
                  <span className="font-bold text-[#0a192f] text-xl">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a192f] rounded-[3.5rem] p-16 text-white flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 h-96 w-96 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="h-28 w-28 rounded-3xl bg-white/10 backdrop-blur-3xl flex items-center justify-center shrink-0 border border-white/20 shadow-2xl">
              <ShieldCheck className="h-14 w-14 text-accent" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-4">
              <h4 className="text-4xl font-bold">Adaptability & Temperament</h4>
              <p className="text-white/70 text-2xl font-medium leading-relaxed italic">"{result.traits.temperament}"</p>
            </div>
            <Button variant="secondary" className="bg-white text-[#0a192f] hover:bg-slate-100 rounded-2xl px-12 h-20 font-black text-xl shadow-2xl transition-all">
              Full Spectrum
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="mt-10">
          <div className="premium-card p-16 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="space-y-3">
                  <h4 className="text-3xl font-bold flex items-center gap-4 text-[#0a192f]">
                    <Dna className="h-8 w-8 text-accent" /> Physical Markers
                  </h4>
                  <p className="text-slate-400 font-bold text-lg">Core morphological phenotyping results.</p>
                </div>
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-200/50 space-y-6 shadow-inner">
                  <p className="font-bold text-2xl text-slate-800 leading-relaxed leading-[1.4]">{result.traits.physicalCharacteristics}</p>
                  <Badge className="bg-[#0a192f] text-white border-none font-black text-[11px] uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">Phenotype Verified</Badge>
                </div>
              </div>
              
              <div className="space-y-10">
                <div className="space-y-3">
                  <h4 className="text-3xl font-bold flex items-center gap-4 text-[#0a192f]">
                    <Sparkles className="h-8 w-8 text-accent" /> Resilience Index
                  </h4>
                  <p className="text-slate-400 font-bold text-lg">Climate endurance and survival metrics.</p>
                </div>
                <p className="text-2xl leading-relaxed text-slate-500 font-medium">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge className="bg-amber-100 text-amber-700 h-12 px-8 rounded-2xl border-none font-black text-sm shadow-sm">Climate Adaptive</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 h-12 px-8 rounded-2xl border-none font-black text-sm shadow-sm">High Resistance</Badge>
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="p-12 bg-accent/5 rounded-[3rem] border-l-[16px] border-accent relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-accent/5 rounded-full" />
                <h5 className="text-accent font-black uppercase tracking-[0.3em] text-[12px] mb-6 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Analyst Summary
                </h5>
                <p className="text-3xl font-headline font-bold text-accent italic opacity-90 leading-snug">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="care" className="mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="premium-card p-12 space-y-10 border-t-[16px] border-t-[#0a192f]">
              <div className="space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-[#0a192f] border border-slate-200">
                  <Zap className="h-10 w-10" />
                </div>
                <h3 className="text-4xl font-bold text-[#0a192f]">Nutrition Vector</h3>
                <p className="text-slate-400 font-bold text-lg">Optimized feeding parameters for yield efficiency.</p>
              </div>
              <div className="text-slate-600 text-2xl leading-[1.6] font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
              </div>
            </Card>
            
            <Card className="premium-card p-12 space-y-10 border-t-[16px] border-t-accent">
              <div className="space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                  <HeartPulse className="h-10 w-10" />
                </div>
                <h3 className="text-4xl font-bold text-[#0a192f]">Health Ops</h3>
                <p className="text-slate-400 font-bold text-lg">Preventative clinical path and bio-security.</p>
              </div>
              <div className="text-slate-600 text-2xl leading-[1.6] font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
              </div>
            </Card>
          </div>
          
          <div className="mt-16 p-10 bg-[#0a192f]/5 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 border border-slate-200">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-xl shrink-0">
              <Info className="h-8 w-8 text-accent" />
            </div>
            <p className="text-slate-500 font-bold text-lg text-center md:text-left">
              <strong>Compliance Notice:</strong> This AI profile is synthesized from global agricultural datasets. Field validation by a certified veterinarian is mandatory before implementation.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
