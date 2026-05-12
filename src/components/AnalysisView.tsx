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
  Fingerprint
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
    downloadAnchorNode.setAttribute("download", `BovIntel_Report_${result.id}.json`);
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
Note: ${result.diagnosticNote}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Report text copied." });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const markers = result.visualMarkers || [];
  const analysis = result.physiologicalAnalysis || { cranial: 'N/A', thoracic: 'N/A', body: 'N/A' };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 px-2" id="printable-area">
      {/* Print-only Header */}
      <div className="hidden print:flex justify-between items-center border-b pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-headline font-bold">BovIntelligence AI Report</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400">ID: {result.id}</p>
          <p className="text-[10px] font-bold text-slate-500">{new Date(result.timestamp).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Visual Header */}
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white print:aspect-[16/9] print:rounded-2xl print:border-2">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 print:bg-none print:relative print:p-2">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-2 print:bg-slate-100 print:text-slate-800">
            Confidence: {result.confidence}
          </Badge>
          <h2 className="text-2xl font-headline font-bold text-white leading-tight print:text-slate-900">{result.breedName}</h2>
        </div>
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
            <DropdownMenuItem onSelect={handlePrint} className="flex gap-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50">
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
        {/* Diagnostic Section */}
        <div className="space-y-4">
          <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-white print:border print:shadow-none analysis-card">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <Microscope className="h-4 w-4 text-accent" />
              <span className="text-[9px] font-bold uppercase">Clinical Note</span>
            </div>
            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
              "{result.diagnosticNote || "Processing diagnostic data..."}"
            </p>
          </Card>

          <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-white space-y-4 print:border print:shadow-none analysis-card">
             <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase text-slate-400">Markers Detected</span>
                <Badge variant="outline" className="text-[8px]">{markers?.length || 0} Points</Badge>
             </div>
             <div className="flex flex-wrap gap-2">
                {markers?.map((marker, i) => (
                  <Badge key={i} className="bg-blue-50 text-blue-600 border-none text-[8px] px-2 py-0.5">
                    {marker}
                  </Badge>
                ))}
             </div>
          </Card>
        </div>

        {/* Morphology Section */}
        <div className="grid gap-3 pt-4 border-t print:border-none">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Morphological Analysis</h3>
           {[
             { title: 'Cranial Morphology', data: analysis.cranial },
             { title: 'Thoracic Morphology', data: analysis.thoracic },
             { title: 'Body Frame', data: analysis.body }
           ].map((item, idx) => (
             <Card key={idx} className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white flex gap-4 print:border analysis-card">
                <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-1 print:hidden" />
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.data}</p>
                </div>
             </Card>
           ))}
        </div>

        {/* Protocol Section */}
        <div className="space-y-4 pt-4 border-t print:border-none">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Care Protocol</h3>
          <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start print:border analysis-card">
             <Zap className="h-5 w-5 text-orange-500 shrink-0 print:hidden" />
             <div className="space-y-1">
               <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Nutrition Management</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.nutritionTips}</p>
             </div>
          </Card>

          <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start print:border analysis-card">
             <HeartPulse className="h-5 w-5 text-red-500 shrink-0 print:hidden" />
             <div className="space-y-1">
               <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Health Protocol</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.healthTips}</p>
             </div>
          </Card>
        </div>
      </div>

      <div className="hidden print:block text-center pt-8 mt-8 border-t text-[8px] text-slate-400 uppercase tracking-widest font-bold">
        &copy; {new Date().getFullYear()} BovIntelligence AI Platform
      </div>
    </div>
  );
}
