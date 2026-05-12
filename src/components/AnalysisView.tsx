
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
    downloadAnchorNode.setAttribute("download", `BovIntel_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Data Exported", description: "Report saved to local vault." });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 px-2">
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-2">
            {result.confidence} Confidence
          </Badge>
          <h2 className="text-2xl font-headline font-bold text-white leading-tight">{result.breedName}</h2>
          <div className="flex items-center gap-2 text-white/50 text-[9px] font-bold uppercase mt-1">
             <FileCheck className="h-3 w-3" /> ID: {result.id}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleExport} className="flex-1 rounded-2xl h-12 bg-[#0F172A] text-white font-bold text-[9px] uppercase tracking-wider gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
        <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 bg-white flex items-center justify-center">
          <Share2 className="h-4 w-4 text-slate-700" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-11 flex gap-1 mb-6">
          <TabsTrigger value="overview" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[8px] uppercase">
            Overview
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[8px] uppercase">
            Genomics
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[8px] uppercase">
            Protocol
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Dna className="h-4 w-4 text-accent" />
              <span className="text-[9px] font-bold uppercase">Lineage & Origin</span>
            </div>
            <p className="text-md font-bold text-slate-800 font-headline italic leading-relaxed">
              "{result.traits.origin}"
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white">
              <h4 className="text-[8px] font-bold text-slate-400 uppercase mb-1">Production</h4>
              <p className="text-[11px] font-bold text-[#0F172A]">{result.traits.milkYieldEstimates}</p>
            </Card>
            <Card className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white">
              <h4 className="text-[8px] font-bold text-slate-400 uppercase mb-1">Behavior</h4>
              <p className="text-[11px] font-bold text-[#0F172A]">{result.traits.temperament}</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          <Card className="rounded-[2rem] p-6 bg-white shadow-sm border-none space-y-4">
             <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase text-accent">Physiology</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{result.traits.physicalCharacteristics}</p>
             </div>
             <div className="h-px bg-slate-50" />
             <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase text-accent">Adaptability</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{result.traits.environmentalAdaptability}</p>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start">
             <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
               <Zap className="h-4 w-4 text-orange-500" />
             </div>
             <div className="space-y-1">
               <h3 className="text-xs font-bold text-[#0F172A] uppercase">Nutrition</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide.nutritionTips}</p>
             </div>
          </Card>

          <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start">
             <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
               <HeartPulse className="h-4 w-4 text-red-500" />
             </div>
             <div className="space-y-1">
               <h3 className="text-xs font-bold text-[#0F172A] uppercase">Health</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide.healthTips}</p>
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
