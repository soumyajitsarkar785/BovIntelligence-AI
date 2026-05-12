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
  BarChart4,
  Scale,
  MapPin,
  Stethoscope
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
      {/* Top Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
            {result.confidence} Confidence
           </Badge>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{result.id}</p>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold text-[#0F172A] tracking-tight">{result.breedName}</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveToHerd} className="rounded-2xl h-14 px-8 bg-accent hover:bg-accent/90 text-white font-bold gap-3 shadow-xl shadow-accent/20">
              <Save className="h-5 w-5" /> Save to Herd
            </Button>
            <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 px-8 border-2 border-slate-100 font-bold gap-3 text-slate-600 hover:bg-slate-50">
              <Download className="h-5 w-5" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs Segmented Controller Style */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] h-16 lg:h-20 flex gap-2 shadow-inner border border-slate-200 mb-8">
          <TabsTrigger value="summary" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-bold text-slate-500 transition-all text-sm lg:text-base">Summary</TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-bold text-slate-500 transition-all text-sm lg:text-base">Profile</TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-lg font-bold text-slate-500 transition-all text-sm lg:text-base">Care</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] p-8 border-none shadow-lg shadow-slate-200/30 bg-white">
              <div className="flex items-center gap-4 text-slate-400 mb-6">
                <Globe className="h-6 w-6" />
                <span className="text-xs font-black uppercase tracking-widest">Historical Origin</span>
              </div>
              <p className="text-xl font-medium text-slate-700 leading-relaxed italic">
                "{result.traits.origin}"
              </p>
            </Card>
            
            <Card className="rounded-[2.5rem] p-8 border-none shadow-lg shadow-slate-200/30 bg-white">
              <div className="flex items-center gap-4 text-slate-400 mb-6">
                <BarChart4 className="h-6 w-6" />
                <span className="text-xs font-black uppercase tracking-widest">Economic Utility</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-400">Primary Use</span>
                  <span className="font-bold text-[#0F172A]">{result.traits.commonUses}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-400">Yield Potential</span>
                  <span className="font-bold text-[#0F172A]">{result.traits.milkYieldEstimates}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[3rem] p-10 bg-[#0F172A] text-white relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-colors" />
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="h-10 w-10 text-accent" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-2xl font-bold mb-2">Behavioral Temperament</h4>
                <p className="text-white/70 text-lg font-medium italic">"{result.traits.temperament}"</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          <Card className="rounded-[2.5rem] p-10 bg-white shadow-xl shadow-slate-200/30 border-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                    <Scale className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#0F172A]">Physical Phenotype</h4>
                    <p className="text-sm text-slate-400 font-medium">Morphological verification.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic font-medium text-slate-600 leading-relaxed text-lg">
                  {result.traits.physicalCharacteristics}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#0F172A]">Environmental Adaptive</h4>
                    <p className="text-sm text-slate-400 font-medium">Climate resilience score.</p>
                  </div>
                </div>
                <p className="text-lg font-medium text-slate-500 leading-relaxed">
                  {result.traits.environmentalAdaptability}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['High Endurance', 'Adaptive Coat', 'Heat Resistant'].map((tag) => (
                    <Badge key={tag} className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl text-xs font-bold">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {result.traits.specialNotes && (
              <div className="mt-12 p-8 bg-amber-50 rounded-[2rem] border-l-8 border-amber-400">
                <div className="flex items-center gap-3 text-amber-600 mb-3">
                  <Info className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Pro Analyst Note</span>
                </div>
                <p className="text-lg font-bold text-amber-800 italic">
                  "{result.traits.specialNotes}"
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] p-10 bg-white shadow-xl shadow-slate-200/30 border-none relative overflow-hidden">
               <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2" />
               <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0F172A] mb-8">
                <Zap className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-bold text-[#0F172A] mb-4">Nutrition Plan</h3>
               <div className="text-slate-500 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.nutritionTips}
               </div>
            </Card>

            <Card className="rounded-[3rem] p-10 bg-white shadow-xl shadow-slate-200/30 border-none relative overflow-hidden">
               <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full translate-x-1/2 -translate-y-1/2" />
               <div className="h-16 w-16 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-8">
                <HeartPulse className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-bold text-[#0F172A] mb-4">Health Management</h3>
               <div className="text-slate-500 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {result.careGuide.healthTips}
               </div>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] p-8 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Schedule Vaccination</h4>
                <p className="text-white/70 text-sm font-medium">Recommended for this breed type.</p>
              </div>
            </div>
            <Button variant="secondary" className="rounded-xl h-12 bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6">
              Set Reminder
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
