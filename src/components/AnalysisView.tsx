
'use client';

import { ScanEntry } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  Zap, 
  HeartPulse, 
  Activity,
  Scale,
  Share2,
  FileCheck,
  Dna
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
    downloadAnchorNode.setAttribute("download", `report_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Report Exported", description: "Saved to local storage." });
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500 px-2">
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-2">
            {result.confidence} Match
          </Badge>
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-bold text-white">{result.breedName}</h2>
            <div className="flex items-center gap-2 text-white/60 text-[9px] font-bold uppercase tracking-widest">
               <FileCheck className="h-3 w-3" /> {result.id}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleExport} className="flex-1 rounded-2xl h-14 bg-[#0F172A] text-white font-bold text-[10px] uppercase tracking-widest gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 bg-white shadow-sm flex items-center justify-center">
          <Share2 className="h-5 w-5 text-slate-700" />
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-12 flex gap-1 mb-6">
          <TabsTrigger value="summary" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[9px] uppercase">
            Overview
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[9px] uppercase">
            Genomics
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[9px] uppercase">
            Protocol
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card className="rounded-[2rem] p-6 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <Dna className="h-4 w-4 text-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Origin</span>
            </div>
            <p className="text-lg font-bold text-slate-800 font-headline italic">
              "{result.traits.origin}"
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-[1.5rem] p-5 border-none shadow-sm bg-white">
              <h4 className="text-[8px] font-bold text-slate-400 uppercase mb-1">Production</h4>
              <p className="text-xs font-bold text-[#0F172A]">{result.traits.milkYieldEstimates}</p>
            </Card>
            <Card className="rounded-[1.5rem] p-5 border-none shadow-sm bg-white">
              <h4 className="text-[8px] font-bold text-slate-400 uppercase mb-1">Primary Use</h4>
              <p className="text-xs font-bold text-[#0F172A]">{result.traits.commonUses}</p>
            </Card>
          </div>

          <Card className="rounded-[2rem] p-5 bg-[#0F172A] text-white shadow-sm flex items-center gap-4">
            <Activity className="h-6 w-6 text-accent" />
            <div className="space-y-0.5">
              <h4 className="text-[8px] font-bold uppercase text-white/40">Temperament</h4>
              <p className="text-sm font-bold">{result.traits.temperament}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          <Card className="rounded-[2rem] p-6 bg-white shadow-sm border-none">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-accent" />
                  <h4 className="text-[9px] font-bold uppercase text-slate-800">Morphology</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">{result.traits.physicalCharacteristics}</p>
              </div>
              <div className="space-y-3 pt-2 border-t border-slate-50">
                <h4 className="text-[9px] font-bold uppercase text-slate-800">Adaptability</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{result.traits.environmentalAdaptability}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <Card className="rounded-[2rem] p-6 bg-white shadow-sm border-none">
             <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-headline font-bold text-[#0F172A]">Nutrition</h3>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">{result.careGuide.nutritionTips}</p>
          </Card>

          <Card className="rounded-[2rem] p-6 bg-white shadow-sm border-none">
             <div className="flex items-center gap-3 mb-4">
                <HeartPulse className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-headline font-bold text-[#0F172A]">Biosecurity</h3>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">{result.careGuide.healthTips}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
