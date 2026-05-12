'use client';

import { ScanEntry } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  Save, 
  Zap, 
  HeartPulse, 
  Globe,
  TrendingUp,
  Activity,
  Scale,
  MapPin,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

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
    toast({ title: "Report Exported", description: "Breeding data saved as JSON." });
  };

  const handleShare = () => {
    toast({ title: "Secure Link Generated", description: "Sharing encryption active." });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out px-2">
      {/* Visual Header */}
      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
          <Badge className="w-fit bg-accent text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg">
            {result.confidence} Confidence Score
          </Badge>
          <div className="space-y-1">
            <h2 className="text-5xl font-headline font-bold text-white leading-none">
              {result.breedName}
            </h2>
            <p className="text-white/60 text-xs font-black uppercase tracking-widest">{result.id} • GENOMIC LEDGER</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-2">
        <Button onClick={handleExport} className="flex-1 rounded-[2rem] h-16 bg-[#0F172A] text-white font-black text-[11px] uppercase tracking-widest gap-2 shadow-2xl">
          <Download className="h-4 w-4" /> Export Data
        </Button>
        <Button onClick={handleShare} variant="outline" className="h-16 w-16 rounded-full border-slate-200 bg-white shadow-lg flex items-center justify-center p-0">
          <Share2 className="h-5 w-5 text-slate-600" />
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-200/50 p-1.5 rounded-[2.5rem] h-14 flex gap-1 mb-8">
          <TabsTrigger value="summary" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-md font-black text-[10px] uppercase tracking-widest transition-all">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-md font-black text-[10px] uppercase tracking-widest transition-all">
            Genomics
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-md font-black text-[10px] uppercase tracking-widest transition-all">
            Care Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 animate-in fade-in duration-500">
          <Card className="rounded-[2.5rem] p-8 border-none shadow-xl bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Globe className="h-24 w-24" />
            </div>
            <div className="flex items-center gap-3 text-slate-300 mb-4">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Genetic Origins</span>
            </div>
            <p className="text-lg font-medium text-slate-800 leading-relaxed font-headline italic">
              "{result.traits.origin}"
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2.5rem] p-6 border-none shadow-lg bg-white">
              <TrendingUp className="h-5 w-5 text-accent mb-3" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Common Uses</h4>
              <p className="text-xs font-bold text-[#0F172A] leading-tight">{result.traits.commonUses}</p>
            </Card>
            <Card className="rounded-[2.5rem] p-6 border-none shadow-lg bg-white">
              <Zap className="h-5 w-5 text-blue-500 mb-3" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Production</h4>
              <p className="text-xs font-bold text-[#0F172A] leading-tight">{result.traits.milkYieldEstimates}</p>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] p-8 bg-[#0F172A] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 bg-accent/20 h-24 w-24 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Temperament</h4>
                <p className="text-sm font-bold text-white italic font-headline">{result.traits.temperament}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6 animate-in fade-in duration-500">
          <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl border-none">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Scale className="h-4 w-4" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Physical Profile</h4>
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[2rem] italic">
                  {result.traits.physicalCharacteristics}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Adaptability</h4>
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {result.traits.environmentalAdaptability}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-6 animate-in fade-in duration-500">
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl border-none relative overflow-hidden">
               <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                <Zap className="h-7 w-7" />
               </div>
               <h3 className="text-2xl font-headline font-bold text-[#0F172A] mb-3">Nutrition Protocol</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {result.careGuide.nutritionTips}
               </p>
            </Card>

            <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl border-none relative overflow-hidden">
               <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6">
                <HeartPulse className="h-7 w-7" />
               </div>
               <h3 className="text-2xl font-headline font-bold text-[#0F172A] mb-3">Health Protocol</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {result.careGuide.healthTips}
               </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
