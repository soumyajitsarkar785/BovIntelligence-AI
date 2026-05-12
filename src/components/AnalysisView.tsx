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
  TrendingUp,
  Activity,
  Award,
  ChevronRight,
  Scale,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface AnalysisViewProps {
  result: ScanEntry;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({ title: "Exporting Report", description: "PDF generation started." });
  };

  const handleSaveToHerd = () => {
    toast({ title: "Authenticated", description: "Saved to secure ledger." });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Visual Header */}
      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">
            {result.confidence} Confidence Score
          </Badge>
          <h2 className="text-3xl font-headline font-bold text-white leading-none">
            {result.breedName}
          </h2>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSaveToHerd} className="flex-1 rounded-2xl h-12 bg-[#0F172A] text-white font-bold text-xs gap-2 shadow-lg">
          <Save className="h-4 w-4" /> Save Record
        </Button>
        <Button onClick={handleExport} variant="outline" className="flex-1 rounded-2xl h-12 border-slate-200 font-bold text-xs gap-2 text-slate-600">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12 flex gap-1 mb-6">
          <TabsTrigger value="summary" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[10px] uppercase tracking-wider">
            Info
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[10px] uppercase tracking-wider">
            Traits
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-accent font-bold text-[10px] uppercase tracking-wider">
            Care
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card className="rounded-[2rem] p-6 border-none shadow-md bg-white">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <Globe className="h-4 w-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Origins</span>
            </div>
            <p className="text-sm font-medium text-slate-700 leading-relaxed font-headline italic">
              "{result.traits.origin}"
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2rem] p-5 border-none shadow-md bg-white">
              <TrendingUp className="h-4 w-4 text-accent mb-2" />
              <h4 className="text-[9px] font-black text-slate-400 uppercase mb-1">Purpose</h4>
              <p className="text-xs font-bold text-[#0F172A]">{result.traits.commonUses}</p>
            </Card>
            <Card className="rounded-[2rem] p-5 border-none shadow-md bg-white">
              <Zap className="h-4 w-4 text-accent mb-2" />
              <h4 className="text-[9px] font-black text-slate-400 uppercase mb-1">Production</h4>
              <p className="text-xs font-bold text-[#0F172A]">{result.traits.milkYieldEstimates}</p>
            </Card>
          </div>

          <Card className="rounded-[2rem] p-6 bg-[#0F172A] text-white">
            <div className="flex items-center gap-4">
              <Activity className="h-6 w-6 text-accent" />
              <div>
                <h4 className="text-sm font-bold">Temperament</h4>
                <p className="text-[11px] text-white/70 italic font-headline">{result.traits.temperament}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          <Card className="rounded-[2rem] p-6 bg-white shadow-md border-none">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-accent" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Physical Profile</h4>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                  {result.traits.physicalCharacteristics}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Adaptability</h4>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  {result.traits.environmentalAdaptability}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <div className="space-y-4">
            <Card className="rounded-[2rem] p-6 bg-white shadow-md border-none">
               <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                <Zap className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-bold text-[#0F172A] mb-2">Nutrition</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {result.careGuide.nutritionTips}
               </p>
            </Card>

            <Card className="rounded-[2rem] p-6 bg-white shadow-md border-none">
               <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
                <HeartPulse className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-bold text-[#0F172A] mb-2">Health</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {result.careGuide.healthTips}
               </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
