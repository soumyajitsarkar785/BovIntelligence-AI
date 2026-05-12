
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
  Scale,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';

// Client-side libraries for direct PDF download
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisViewProps {
  result: ScanEntry;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `BovIntelligence_Report_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Exported", description: "JSON data saved to your downloads folder." });
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
    toast({ title: "Copied", description: "Report text copied to clipboard." });
  };

  /**
   * DIRECT PDF DOWNLOAD:
   * Uses html2canvas and jsPDF to create a file and download it directly.
   */
  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    setIsExporting(true);
    toast({ title: "Generating PDF", description: "Creating a high-resolution professional report..." });

    try {
      // Capture the report element
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BovIntelligence_Report_${result.id}.pdf`);

      toast({ title: "Success", description: "Professional PDF saved to your downloads folder." });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({ variant: "destructive", title: "Export Failed", description: "Could not generate PDF file." });
    } finally {
      setIsExporting(false);
    }
  };

  const markers = result.visualMarkers || [];
  const analysis = result.physiologicalAnalysis || { cranial: 'N/A', thoracic: 'N/A', body: 'N/A' };
  const traits = result.traits;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 px-2" id="printable-area">
      {/* Visual Header */}
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
        <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
          <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-2">
            Confidence: {result.confidence}
          </Badge>
          <h2 className="text-2xl font-headline font-bold text-white leading-tight">{result.breedName}</h2>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-2xl h-12 bg-[#0F172A] text-white font-bold text-[9px] uppercase tracking-wider gap-2">
              <Download className="h-4 w-4" /> {isExporting ? 'Generating...' : 'Export Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={handleDownloadPDF} 
              className="flex gap-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50"
            >
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Download PDF</span>
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
        <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-white">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Microscope className="h-4 w-4 text-accent" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Diagnostic Summary</span>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
            "{result.diagnosticNote || "Processing diagnostic data..."}"
          </p>
        </Card>

        {/* Genomic Traits Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
            <Dna className="h-3 w-3 text-accent" /> Genomic Profile & Phenotype
          </h3>
          <div className="grid gap-3">
            {[
              { label: 'Origin & Heritage', value: traits.origin },
              { label: 'Production Metrics', value: traits.milkYieldEstimates },
              { label: 'Ecological Resilience', value: traits.environmentalAdaptability },
              { label: 'Ethological Profile', value: traits.temperament },
              { label: 'Morphological Standards', value: traits.physicalCharacteristics },
              { label: 'Commercial Utilization', value: traits.commonUses }
            ].map((trait, i) => (
              <Card key={i} className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white">
                <h4 className="text-[8px] font-bold uppercase text-accent mb-1">{trait.label}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{trait.value}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-3 pt-4 border-t">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2 col-span-full">
             <Scale className="h-3 w-3 text-accent" /> Morphological Breakdown
           </h3>
           {[
             { title: 'Cranial Analysis', data: analysis.cranial },
             { title: 'Thoracic Analysis', data: analysis.thoracic },
             { title: 'Body Frame Analysis', data: analysis.body }
           ].map((item, idx) => (
             <Card key={idx} className="rounded-[1.5rem] p-4 border-none shadow-sm bg-white flex gap-4">
                <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.data}</p>
                </div>
             </Card>
           ))}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Livestock Care Protocols</h3>
          <div className="grid gap-3">
            <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start">
               <Zap className="h-5 w-5 text-orange-500 shrink-0" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Nutritional Strategy</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.nutritionTips}</p>
               </div>
            </Card>

            <Card className="rounded-[2rem] p-5 bg-white shadow-sm border-none flex gap-4 items-start">
               <HeartPulse className="h-5 w-5 text-red-500 shrink-0" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Clinical Health Management</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.healthTips}</p>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
