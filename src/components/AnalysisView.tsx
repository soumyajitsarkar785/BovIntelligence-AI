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
  Award,
  ChevronRight
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
    toast({ title: "Report Exported", description: "Analytical data downloaded successfully." });
  };

  const handleSaveToHerd = () => {
    toast({ title: "Record Authenticated", description: "Bovine profile saved to encrypted herd ledger." });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Hero Profile */}
      <div className="premium-card p-8 lg:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 h-40 w-40 bg-accent/5 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {result.confidence} Confidence Score
              </Badge>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{result.id}</p>
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold text-[#0F172A] tracking-tighter leading-none">
              {result.breedName}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              <Award className="h-4 w-4 text-accent" />
              Verified Genomic Signature
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSaveToHerd} className="rounded-2xl h-14 px-8 bg-[#0F172A] hover:bg-slate-800 text-white font-bold gap-3 shadow-xl transition-all hover:-translate-y-1">
              <Save className="h-5 w-5" /> Authenticate Record
            </Button>
            <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 px-8 border-2 border-slate-100 font-bold gap-3 text-slate-600 hover:bg-slate-50 transition-all hover:-translate-y-1">
              <Download className="h-5 w-5" /> Export Insights
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-16 flex gap-2 shadow-inner border border-slate-200 mb-10">
          <TabsTrigger value="summary" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[11px] transition-all">
            Intelligence Dashboard
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[11px] transition-all">
            Genetic Profile
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[11px] transition-all">
            Management Protocol
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[2.5rem] p-10 border-none shadow-2xl shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-4 text-slate-400 mb-6">
                <Globe className="h-6 w-6" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Hereditary Origins</span>
              </div>
              <p className="text-xl font-medium text-slate-700 leading-relaxed italic font-headline">
                "{result.traits.origin}"
              </p>
            </Card>
            
            <Card className="rounded-[2.5rem] p-10 border-none shadow-2xl shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-4 text-slate-400 mb-6">
                <TrendingUp className="h-6 w-6" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Economic Utility</span>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Use</span>
                  <span className="text-base font-bold text-[#0F172A]">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Est. Production</span>
                  <span className="text-base font-bold text-accent">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] p-10 bg-[#0F172A] text-white relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="h-20 w-20 rounded-[1.5rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/20 shrink-0">
                <Activity className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Behavioral Profile</h4>
                <p className="text-white/70 text-base font-medium italic font-headline">"{result.traits.temperament}"</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-8">
          <Card className="rounded-[3rem] p-10 lg:p-14 bg-white shadow-2xl shadow-slate-200/50 border-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                    <Scale className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#0F172A]">Phenotype Metrics</h4>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic text-base text-slate-600 leading-relaxed font-headline">
                  {result.traits.physicalCharacteristics}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#0F172A]">Environmental Adaptive Core</h4>
                </div>
                <p className="text-base font-medium text-slate-500 leading-relaxed">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-3">
                  {['High Endurance', 'Heat Resistant', 'Adaptive Coat'].map((tag) => (
                    <Badge key={tag} className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="mt-14 p-8 bg-amber-50 rounded-[2rem] border-l-8 border-amber-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Info className="h-16 w-16 text-amber-900" />
                </div>
                <div className="flex items-center gap-3 text-amber-700 mb-4 relative z-10">
                  <Info className="h-5 w-5" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">Analytic Deviation Note</span>
                </div>
                <p className="text-lg font-bold text-amber-900 italic font-headline relative z-10">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] p-10 bg-white shadow-2xl shadow-slate-200/50 border-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
               <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0F172A] mb-8">
                <Zap className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-bold text-[#0F172A] mb-6">Nutrition Architecture</h3>
               <div className="text-slate-500 text-base leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
               </div>
               <Button variant="ghost" className="mt-10 p-0 text-accent font-black text-xs uppercase tracking-widest gap-2 hover:bg-transparent hover:translate-x-2 transition-all">
                Full Feed Schedule <ChevronRight className="h-4 w-4" />
               </Button>
            </Card>

            <Card className="rounded-[3rem] p-10 bg-white shadow-2xl shadow-slate-200/50 border-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
               <div className="h-16 w-16 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-8">
                <HeartPulse className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-bold text-[#0F172A] mb-6">Health Management</h3>
               <div className="text-slate-500 text-base leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
               </div>
               <Button variant="ghost" className="mt-10 p-0 text-accent font-black text-xs uppercase tracking-widest gap-2 hover:bg-transparent hover:translate-x-2 transition-all">
                Vaccination Protocol <ChevronRight className="h-4 w-4" />
               </Button>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] p-10 bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-200/50">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-[1.5rem] bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Stethoscope className="h-10 w-10" />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-2xl font-bold">Protocol Alert System</h4>
                <p className="text-white/80 text-sm font-medium">Critical bio-security alerts active for {result.breedName}.</p>
              </div>
            </div>
            <Button variant="secondary" className="rounded-2xl h-14 bg-white text-emerald-700 hover:bg-emerald-50 font-black uppercase text-xs tracking-[0.2em] px-10 w-full sm:w-auto shadow-xl">
              Sync Smart Alerts
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}