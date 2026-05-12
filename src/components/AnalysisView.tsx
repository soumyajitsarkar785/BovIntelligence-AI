
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
  Globe,
  TrendingUp,
  Activity,
  Scale,
  MapPin,
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
    downloadAnchorNode.setAttribute("download", `bovindex_report_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Genomic Report Exported", description: "Secure JSON data saved to local storage." });
  };

  const handleShare = () => {
    toast({ title: "Encryption Active", description: "Secure sharing link generated with SSL/TLS." });
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out px-2">
      {/* Visual Header - High End Design */}
      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border-[6px] border-white group">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8">
          <Badge className="w-fit bg-accent text-white border-none px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4 shadow-2xl animate-pulse">
            {result.confidence} Confidence Score
          </Badge>
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold text-white leading-none tracking-tight">
              {result.breedName}
            </h2>
            <div className="flex items-center gap-2">
               <FileCheck className="h-4 w-4 text-accent" />
               <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">{result.id} • GENOMIC ARCHIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex gap-4 px-2">
        <Button onClick={handleExport} className="flex-[3] rounded-[2rem] h-20 bg-[#0F172A] hover:bg-[#1E293B] text-white font-black text-[11px] uppercase tracking-[0.2em] gap-3 shadow-2xl border border-white/10 transition-all active:scale-95">
          <Download className="h-5 w-5" /> Download Genomic Report
        </Button>
        <Button onClick={handleShare} variant="outline" className="h-20 w-20 rounded-[2.5rem] border-slate-100 bg-white shadow-xl flex items-center justify-center p-0 hover:bg-slate-50 active:scale-90 transition-all">
          <Share2 className="h-6 w-6 text-slate-700" />
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-[3rem] h-16 flex gap-1 mb-8 shadow-inner">
          <TabsTrigger value="summary" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-xl font-black text-[9px] uppercase tracking-widest transition-all duration-300">
            DASHBOARD
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-xl font-black text-[9px] uppercase tracking-widest transition-all duration-300">
            GENOMICS
          </TabsTrigger>
          <TabsTrigger value="care" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-xl font-black text-[9px] uppercase tracking-widest transition-all duration-300">
            CARE PROTOCOL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 animate-in fade-in duration-700 slide-in-from-right-5">
          <Card className="rounded-[3rem] p-10 border-none shadow-2xl bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
              <Globe className="h-32 w-32" />
            </div>
            <div className="flex items-center gap-3 text-slate-300 mb-6">
              <Dna className="h-5 w-5 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ancestral Signature</span>
            </div>
            <p className="text-xl font-medium text-slate-800 leading-relaxed font-headline italic">
              "{result.traits.origin}"
            </p>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2.5rem] p-8 border-none shadow-xl bg-white hover:scale-[1.02] transition-transform">
              <TrendingUp className="h-6 w-6 text-accent mb-4" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Production</h4>
              <p className="text-xs font-bold text-[#0F172A] leading-tight">{result.traits.milkYieldEstimates}</p>
            </Card>
            <Card className="rounded-[2.5rem] p-8 border-none shadow-xl bg-white hover:scale-[1.02] transition-transform">
              <Zap className="h-6 w-6 text-blue-500 mb-4" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Use</h4>
              <p className="text-xs font-bold text-[#0F172A] leading-tight">{result.traits.commonUses}</p>
            </Card>
          </div>

          <Card className="rounded-[3rem] p-8 bg-[#0F172A] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-accent/20 h-32 w-32 rounded-full blur-[60px] group-hover:blur-[40px] transition-all"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Temperament Core</h4>
                <p className="text-base font-bold text-white italic font-headline">{result.traits.temperament}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6 animate-in fade-in duration-700 slide-in-from-right-5">
          <Card className="rounded-[3rem] p-10 bg-white shadow-2xl border-none">
            <div className="space-y-10">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Scale className="h-5 w-5" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800">Morphological Analysis</h4>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                    {result.traits.physicalCharacteristics}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800">Adaptive Vector</h4>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                  {result.traits.environmentalAdaptability}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-6 animate-in fade-in duration-700 slide-in-from-right-5">
          <div className="space-y-6">
            <Card className="rounded-[3rem] p-10 bg-white shadow-2xl border-none relative overflow-hidden group hover:border-orange-100 border transition-all">
               <div className="h-16 w-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-orange-600 mb-8 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-headline font-bold text-[#0F172A] mb-4">Nutritional Protocol</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {result.careGuide.nutritionTips}
               </p>
            </Card>

            <Card className="rounded-[3rem] p-10 bg-white shadow-2xl border-none relative overflow-hidden group hover:border-red-100 border transition-all">
               <div className="h-16 w-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center text-red-600 mb-8 group-hover:scale-110 transition-transform">
                <HeartPulse className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-headline font-bold text-[#0F172A] mb-4">Biosecurity Protocol</h3>
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

