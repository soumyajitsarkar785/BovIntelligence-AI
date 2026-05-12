
'use client';

import { ScanEntry } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  Zap, 
  HeartPulse, 
  Share2,
  Microscope,
  ChevronRight,
  Copy,
  Printer,
  FileJson,
  Fingerprint,
  Dna,
  Scale
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalysisViewProps {
  result: ScanEntry;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  const { toast } = useToast();

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `BovIntelligence_Report_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Exported", description: "JSON data saved." });
  };

  const handleCopyText = () => {
    const text = `
BovIntelligence AI Diagnostic Report
-------------------------
ID: ${result.id}
Breed: ${result.breedName}
Confidence: ${result.confidence}
Diagnosis: ${result.diagnosticNote}
-------------------------
Traits:
- Origin: ${result.traits.origin}
- Milk Yield: ${result.traits.milkYieldEstimates}
- Temperament: ${result.traits.temperament}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Report text copied." });
  };

  /**
   * ROBUST PRINTING:
   * Uses a timeout to allow Radix UI menu to close fully before triggering print.
   */
  const handlePrint = () => {
    toast({ title: "Preparing Document", description: "Finalizing report for printing..." });
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 500);
  };

  const markers = result.visualMarkers || [];
  const analysis = result.physiologicalAnalysis || { cranial: 'N/A', thoracic: 'N/A', body: 'N/A' };
  const traits = result.traits;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 px-2" id="printable-area">
      {/* Print-only Header */}
      <div className="hidden print:flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Fingerprint className="h-10 w-10 text-slate-900" />
          <div>
            <h1 className="text-2xl font-headline font-bold uppercase tracking-tight">BovIntelligence AI</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Genomic Research Platform</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400">REPORT ID: <span className="text-slate-900">{result.id}</span></p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(result.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Visual Header */}
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white print:aspect-[16/9] print:rounded-2xl print:border-none print:shadow-none">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 print:hidden">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-2">
            Confidence: {result.confidence}
          </Badge>
          <h2 className="text-2xl font-headline font-bold text-white leading-tight">{result.breedName}</h2>
        </div>
      </div>
      
      {/* Print-only Breed Label */}
      <div className="hidden print:block mb-8">
        <Badge variant="outline" className="border-slate-900 text-slate-900 text-[10px] px-4 py-1 rounded-full uppercase font-black mb-2">
          Diagnostic Verdict: {result.confidence} Confidence
        </Badge>
        <h2 className="text-4xl font-headline font-bold text-slate-900">{result.breedName}</h2>
      </div>

      {/* Actions (Hidden in Print) */}
      <div className="flex gap-3 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex-1 rounded-2xl h-12 bg-[#0F172A] text-white font-bold text-[9px] uppercase tracking-wider gap-2">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={handlePrint} 
              className="flex gap-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Print / Save PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCopyText} className="flex gap-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExportJSON} className="flex gap-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">JSON Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 bg-white flex items-center justify-center">
          <Share2 className="h-4 w-4 text-slate-700" />
        </Button>
      </div>

      {/* Analysis Content */}
      <div className="space-y-6">
        <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-white print:border-none print:bg-slate-50 print:p-8 analysis-card">
          <div className="flex items-center gap-2 text-slate-400 mb-3 print:mb-4">
            <Microscope className="h-4 w-4 text-accent print:text-slate-900" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Diagnostic Summary</span>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed italic print:text-lg print:text-slate-900">
            "{result.diagnosticNote || "Processing diagnostic data..."}"
          </p>
        </Card>

        {/* Genomic Traits Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2 print:text-slate-900 print:text-sm">
            <Dna className="h-3 w-3 text-accent print:text-slate-900" /> Genomic Profile & Phenotype
          </h3>
          <div className="grid gap-3 print:grid-cols-2">
            {[
              { label: 'Origin & Heritage', value: traits.origin },
              { label: 'Production Metrics', value: traits.milkYieldEstimates },
              { label: 'Ecological Resilience', value: traits.environmentalAdaptability },
              { label: 'Ethological Profile', value: traits.temperament },
              { label: 'Morphological Standards', value: traits.physicalCharacteristics },
              { label: 'Commercial Utilization', value: traits.commonUses }
            ].map((trait, i) => (
              <Card key={i} className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white print:border-none print:shadow-none print:bg-white print:p-0 analysis-card">
                <h4 className="text-[8px] font-bold uppercase text-accent mb-1 print:text-slate-900 print:text-[10px] print:mb-2">{trait.label}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed print:text-xs print:text-slate-700">{trait.value}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-3 pt-4 border-t print:border-none print:grid-cols-3">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2 col-span-full print:text-slate-900 print:text-sm">
             <Scale className="h-3 w-3 text-accent print:text-slate-900" /> Morphological Breakdown
           </h3>
           {[
             { title: 'Cranial Analysis', data: analysis.cranial },
             { title: 'Thoracic Analysis', data: analysis.thoracic },
             { title: 'Body Frame Analysis', data: analysis.body }
           ].map((item, idx) => (
             <Card key={idx} className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white flex gap-4 print:flex-col print:border-none print:bg-white analysis-card">
                <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-1 print:hidden" />
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase text-slate-800 print:text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight print:text-xs">{item.data}</p>
                </div>
             </Card>
           ))}
        </div>

        <div className="space-y-4 pt-4 border-t print:border-none">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 print:text-slate-900 print:text-sm">Livestock Care Protocols</h3>
          <div className="grid gap-3 print:grid-cols-2">
            <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start print:bg-slate-50 print:border-none analysis-card">
               <Zap className="h-5 w-5 text-orange-500 shrink-0 print:hidden" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase print:text-[10px]">Nutritional Strategy</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed print:text-xs">{result.careGuide?.nutritionTips}</p>
               </div>
            </Card>

            <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start print:bg-slate-50 print:border-none analysis-card">
               <HeartPulse className="h-5 w-5 text-red-500 shrink-0 print:hidden" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase print:text-[10px]">Clinical Health Management</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed print:text-xs">{result.careGuide?.healthTips}</p>
               </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="hidden print:block text-center pt-12 mt-12 border-t border-slate-200 text-[9px] text-slate-400 uppercase tracking-widest font-black">
        This is a computer-generated diagnostic report powered by BovIntelligence AI.<br/>
        Valid only for genomic research and livestock management purposes.
      </div>
    </div>
  );
}
