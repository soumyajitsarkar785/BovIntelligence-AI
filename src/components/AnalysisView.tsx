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
    toast({ title: "Export Initialized", description: "Analytical report downloaded." });
  };

  const handleSaveToHerd = () => {
    toast({ title: "Asset Committed", description: "Profile saved to cloud ledger." });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 md:slide-in-from-bottom-10 duration-700 md:duration-1000">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-10">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-sm">
              Confidence: {result.confidence}
            </Badge>
            <span className="h-1.5 w-1.5 bg-slate-300 rounded-full hidden sm:block"></span>
            <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{result.id}</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-headline font-bold text-[#0a192f] tracking-tight leading-tight md:leading-[0.9]">{result.breedName}</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button onClick={handleExport} variant="outline" className="rounded-xl md:rounded-2xl h-12 md:h-16 px-6 md:px-10 border-2 border-slate-200 font-black gap-2 md:gap-3 hover:bg-slate-50 transition-all text-slate-700">
            <Download className="h-5 w-5 md:h-6 md:w-6" /> Export
          </Button>
          <Button onClick={handleSaveToHerd} className="rounded-xl md:rounded-2xl h-12 md:h-16 px-6 md:px-10 bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/20 font-black gap-2 md:gap-3 text-white transition-all text-base md:text-lg">
            <Save className="h-5 w-5 md:h-6 md:w-6" /> Save Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="bg-slate-100 p-1.5 md:p-2 rounded-xl md:rounded-[2rem] border border-slate-200 shadow-inner h-14 md:h-20 flex gap-1 md:gap-2 w-max sm:w-auto">
            <TabsTrigger value="summary" className="rounded-lg md:rounded-2xl px-6 md:px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all text-xs md:text-base">Summary</TabsTrigger>
            <TabsTrigger value="traits" className="rounded-lg md:rounded-2xl px-6 md:px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all text-xs md:text-base">Profile</TabsTrigger>
            <TabsTrigger value="care" className="rounded-lg md:rounded-2xl px-6 md:px-12 data-[state=active]:bg-[#0a192f] data-[state=active]:text-white data-[state=active]:shadow-2xl font-bold h-full transition-all text-xs md:text-base">Care</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="summary" className="mt-6 md:mt-10 space-y-6 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="premium-card p-8 md:p-12 space-y-6 md:space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 md:h-32 md:w-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-4 md:gap-5 text-[#0a192f]">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  <Globe className="h-5 w-5 md:h-7 md:w-7" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold">Historical Origin</h4>
              </div>
              <p className="text-base md:text-xl leading-relaxed text-slate-500 font-medium italic">
                {result.traits.origin}
              </p>
            </div>
            
            <div className="premium-card p-8 md:p-12 space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 md:gap-5 text-accent">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-accent/5 flex items-center justify-center border border-accent/10">
                  <BarChart4 className="h-5 w-5 md:h-7 md:w-7" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold">Utility Index</h4>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center py-4 md:py-5 border-b border-slate-50">
                  <span className="text-slate-400 font-black text-[9px] md:text-[11px] uppercase tracking-widest">Primary Use</span>
                  <span className="font-bold text-[#0a192f] text-lg md:text-xl">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-4 md:py-5 border-b border-slate-50">
                  <span className="text-slate-400 font-black text-[9px] md:text-[11px] uppercase tracking-widest">Yield Range</span>
                  <span className="font-bold text-[#0a192f] text-lg md:text-xl">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a192f] rounded-2xl md:rounded-[3.5rem] p-8 md:p-16 text-white flex flex-col lg:flex-row items-center gap-10 md:gap-16 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 h-64 w-64 md:h-96 md:w-96 bg-accent/10 rounded-full blur-[60px] md:blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="h-20 w-20 md:h-28 md:w-28 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-3xl flex items-center justify-center shrink-0 border border-white/20 shadow-2xl">
              <ShieldCheck className="h-10 w-10 md:h-14 md:w-14 text-accent" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-3 md:space-y-4">
              <h4 className="text-2xl md:text-4xl font-bold">Temperament</h4>
              <p className="text-white/70 text-lg md:text-2xl font-medium leading-relaxed italic">"{result.traits.temperament}"</p>
            </div>
            <Button variant="secondary" className="bg-white text-[#0a192f] hover:bg-slate-100 rounded-xl md:rounded-2xl px-8 md:px-12 h-14 md:h-20 font-black text-base md:text-xl shadow-2xl transition-all w-full lg:w-auto">
              Full Spectrum
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="mt-6 md:mt-10">
          <div className="premium-card p-8 md:p-16 space-y-10 md:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
              <div className="space-y-6 md:space-y-10">
                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-2xl md:text-3xl font-bold flex items-center gap-3 md:gap-4 text-[#0a192f]">
                    <Dna className="h-6 w-6 md:h-8 md:w-8 text-accent" /> Physical Markers
                  </h4>
                  <p className="text-slate-400 font-bold text-sm md:text-lg">Morphological phenotyping results.</p>
                </div>
                <div className="p-6 md:p-10 bg-slate-50 rounded-2xl md:rounded-[3rem] border border-slate-200/50 space-y-4 md:space-y-6 shadow-inner">
                  <p className="font-bold text-lg md:text-2xl text-slate-800 leading-relaxed">{result.traits.physicalCharacteristics}</p>
                  <Badge className="bg-[#0a192f] text-white border-none font-black text-[9px] md:text-[11px] uppercase tracking-widest px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-lg">Verified</Badge>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-10">
                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-2xl md:text-3xl font-bold flex items-center gap-3 md:gap-4 text-[#0a192f]">
                    <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-accent" /> Resilience
                  </h4>
                  <p className="text-slate-400 font-bold text-sm md:text-lg">Climate endurance metrics.</p>
                </div>
                <p className="text-lg md:text-2xl leading-relaxed text-slate-500 font-medium">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <Badge className="bg-amber-100 text-amber-700 h-10 md:h-12 px-4 md:px-8 rounded-xl md:rounded-2xl border-none font-black text-[10px] md:text-sm">Adaptive</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 h-10 md:h-12 px-4 md:px-8 rounded-xl md:rounded-2xl border-none font-black text-[10px] md:text-sm">High Resistance</Badge>
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="p-8 md:p-12 bg-accent/5 rounded-2xl md:rounded-[3rem] border-l-[8px] md:border-l-[16px] border-accent relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 h-24 w-24 md:h-40 md:w-40 bg-accent/5 rounded-full" />
                <h5 className="text-accent font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[12px] mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Analyst Summary
                </h5>
                <p className="text-xl md:text-3xl font-headline font-bold text-accent italic opacity-90 leading-tight">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="care" className="mt-6 md:mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <Card className="premium-card p-8 md:p-12 space-y-6 md:space-y-10 border-t-[8px] md:border-t-[16px] border-t-[#0a192f]">
              <div className="space-y-4 md:space-y-6">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] md:rounded-[2rem] bg-slate-100 flex items-center justify-center text-[#0a192f] border border-slate-200">
                  <Zap className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#0a192f]">Nutrition</h3>
                <p className="text-slate-400 font-bold text-sm md:text-lg">Optimized feeding parameters.</p>
              </div>
              <div className="text-slate-600 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
              </div>
            </Card>
            
            <Card className="premium-card p-8 md:p-12 space-y-6 md:space-y-10 border-t-[8px] md:border-t-[16px] border-t-accent">
              <div className="space-y-4 md:space-y-6">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] md:rounded-[2rem] bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                  <HeartPulse className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#0a192f]">Health Path</h3>
                <p className="text-slate-400 font-bold text-sm md:text-lg">Preventative clinical guidance.</p>
              </div>
              <div className="text-slate-600 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
