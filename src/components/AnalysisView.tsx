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
  Globe,
  Scale,
  MapPin,
  Stethoscope,
  TrendingUp,
  Activity,
  Award
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
    toast({ title: "Record Saved", description: "Profile has been added to your herd ledger." });
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/50 border border-white/50 relative overflow-hidden">
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
           <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
            {result.confidence} Confidence
           </Badge>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{result.id}</p>
            <h2 className="text-4xl lg:text-6xl font-headline font-bold text-[#0F172A] tracking-tight">{result.breedName}</h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm">Premium Genetic Classification</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveToHerd} className="rounded-2xl h-12 px-6 bg-[#0F172A] hover:bg-slate-800 text-white font-bold gap-3 shadow-xl">
              <Save className="h-4 w-4" /> Save Record
            </Button>
            <Button onClick={handleExport} variant="outline" className="rounded-2xl h-12 px-6 border-2 border-slate-100 font-bold gap-3 text-slate-600 hover:bg-slate-50">
              <Download className="h-4 w-4" /> Export JSON
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-200/40 p-1 rounded-2xl h-14 flex gap-1 shadow-inner border border-slate-200 mb-8">
          <TabsTrigger value="summary" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-md font-bold text-slate-500 transition-all text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-md font-bold text-slate-500 transition-all text-sm">Traits</TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-md font-bold text-slate-500 transition-all text-sm">Care Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Card className="rounded-[2rem] p-6 border-none shadow-lg shadow-slate-200/30 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-4 text-slate-400 mb-4">
                <Globe className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Heritage & Origin</span>
              </div>
              <p className="text-lg font-medium text-slate-700 leading-relaxed italic">
                "{result.traits.origin}"
              </p>
            </Card>
            
            <Card className="rounded-[2rem] p-6 border-none shadow-lg shadow-slate-200/30 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-4 text-slate-400 mb-4">
                <TrendingUp className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Economic Potential</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase">Utility</span>
                  <span className="text-sm font-bold text-[#0F172A]">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase">Est. Yield</span>
                  <span className="text-sm font-bold text-accent">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[2rem] p-8 bg-[#0F172A] text-white relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Behavioral Insights</h4>
                <p className="text-white/70 text-sm font-medium italic">"{result.traits.temperament}"</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          <Card className="rounded-[2rem] p-8 bg-white shadow-xl shadow-slate-200/30 border-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">Physical Phenotype</h4>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                  {result.traits.physicalCharacteristics}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">Climate Adaptation</h4>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['High Endurance', 'Heat Resistant', 'Adaptive Coat'].map((tag) => (
                    <Badge key={tag} className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 rounded-lg text-[9px] font-bold uppercase">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="mt-10 p-6 bg-amber-50 rounded-2xl border-l-4 border-amber-400">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Expert Analyst Observation</span>
                </div>
                <p className="text-sm font-bold text-amber-800 italic">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl shadow-slate-200/30 border-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-24 w-24 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
               <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0F172A] mb-6">
                <Zap className="h-6 w-6" />
               </div>
               <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Nutrition Plan</h3>
               <div className="text-slate-500 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
               </div>
            </Card>

            <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl shadow-slate-200/30 border-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
               <div className="h-14 w-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-6">
                <HeartPulse className="h-6 w-6" />
               </div>
               <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Health Protocol</h3>
               <div className="text-slate-500 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
               </div>
            </Card>
          </div>

          <Card className="rounded-2xl p-6 bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold">Vaccination Alert</h4>
                <p className="text-white/70 text-xs">Essential schedule for {result.breedName}.</p>
              </div>
            </div>
            <Button variant="secondary" className="rounded-xl h-10 bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6 w-full sm:w-auto">
              Set Alert
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
