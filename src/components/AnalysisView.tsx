
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
  FileJson,
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

// Client-side libraries for professional PDF generation
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
- Adaptability: ${result.traits.environmentalAdaptability}
- Temperament: ${result.traits.temperament}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Report text copied to clipboard." });
  };

  /**
   * ELITE PRODUCTION-GRADE PDF GENERATION:
   * Captures the entire report as a high-resolution document.
   */
  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsExporting(true);
    toast({ 
      title: "Generating Professional Report", 
      description: "Compiling genomic data and morphological evidence..." 
    });

    try {
      // Create high resolution canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024, // Stabilize capture width
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add to PDF with multi-page support if needed
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`BovIntelligence_Elite_Report_${result.id}.pdf`);

      toast({ 
        title: "Download Complete", 
        description: "Professional PDF secured in your downloads folder." 
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({ 
        variant: "destructive", 
        title: "Export Failed", 
        description: "An error occurred during report generation." 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const analysis = result.physiologicalAnalysis || { cranial: 'N/A', thoracic: 'N/A', body: 'N/A' };
  const traits = result.traits;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Container for PDF Capture */}
      <div id="report-content" className="bg-white p-4 rounded-[2.5rem] space-y-6">
        {/* Visual Header */}
        <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
          <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit bg-accent text-white border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-2">
              Diagnostic Precision: {result.confidence}
            </Badge>
            <h2 className="text-2xl font-headline font-bold text-white leading-tight">{result.breedName}</h2>
          </div>
        </div>

        {/* Diagnostic Metadata */}
        <div className="grid grid-cols-2 gap-3 px-2">
           <Card className="p-4 rounded-3xl bg-slate-50 border-none shadow-sm">
             <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Report ID</p>
             <p className="text-[10px] font-bold text-[#0F172A]">{result.id}</p>
           </Card>
           <Card className="p-4 rounded-3xl bg-slate-50 border-none shadow-sm">
             <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Timestamp</p>
             <p className="text-[10px] font-bold text-[#0F172A]">{new Date(result.timestamp).toLocaleDateString()}</p>
           </Card>
        </div>

        {/* Summary */}
        <Card className="rounded-[2rem] p-5 border-none shadow-sm bg-slate-50 mx-2">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Microscope className="h-4 w-4 text-accent" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Elite Veterinary Summary</span>
          </div>
          <p className="text-[11px] font-medium text-slate-700 leading-relaxed italic">
            "{result.diagnosticNote || "Diagnostic confirmation pending genomic validation."}"
          </p>
        </Card>

        {/* Genomic Traits Section - The core detailed content */}
        <div className="space-y-4 px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Dna className="h-3 w-3 text-accent" /> Genomic Profile & Traits
          </h3>
          <div className="grid gap-3">
            {[
              { label: 'Origin & Geographical Evolution', value: traits.origin },
              { label: 'Genomic Milk Yield & Quality', value: traits.milkYieldEstimates },
              { label: 'Environmental Resilience Factor', value: traits.environmentalAdaptability },
              { label: 'Ethological & Temperament Analysis', value: traits.temperament },
              { label: 'Morphological Conformation', value: traits.physicalCharacteristics },
              { label: 'Commercial Utility Spectrum', value: traits.commonUses }
            ].map((trait, i) => (
              <Card key={i} className="rounded-3xl p-5 border-none shadow-sm bg-white border border-slate-50">
                <h4 className="text-[8px] font-black uppercase text-accent mb-2">{trait.label}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{trait.value}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Morphological Breakdown */}
        <div className="grid gap-3 px-2">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <Scale className="h-3 w-3 text-accent" /> Visual Evidence Markers
           </h3>
           {[
             { title: 'Cranial Architecture', data: analysis.cranial },
             { title: 'Thoracic Musculature', data: analysis.thoracic },
             { title: 'Body Frame Conformation', data: analysis.body }
           ].map((item, idx) => (
             <Card key={idx} className="rounded-3xl p-5 bg-slate-50 border-none shadow-sm flex gap-4">
                <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.data}</p>
                </div>
             </Card>
           ))}
        </div>

        {/* Care Protocols */}
        <div className="space-y-4 px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veterinary Management Protocols</h3>
          <div className="grid gap-3">
            <Card className="rounded-[2rem] p-6 bg-white shadow-md border-l-4 border-orange-500 flex gap-4 items-start">
               <Zap className="h-5 w-5 text-orange-500 shrink-0" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Nutritional Protocol</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.nutritionTips}</p>
               </div>
            </Card>

            <Card className="rounded-[2rem] p-6 bg-white shadow-md border-l-4 border-red-500 flex gap-4 items-start">
               <HeartPulse className="h-5 w-5 text-red-500 shrink-0" />
               <div className="space-y-1">
                 <h3 className="text-[9px] font-bold text-[#0F172A] uppercase">Clinical Health Strategy</h3>
                 <p className="text-[11px] text-slate-500 leading-relaxed">{result.careGuide?.healthTips}</p>
               </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Action Buttons (Excluded from PDF) */}
      <div className="flex gap-3 px-2 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-2xl h-14 bg-[#0F172A] text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-2xl active:scale-95 transition-transform">
              <Download className="h-5 w-5" /> {isExporting ? 'Compiling PDF...' : 'Export Elite Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={handleDownloadPDF} 
              className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50"
            >
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Download Professional PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCopyText} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Clinical Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExportJSON} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Export JSON Ledger</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 bg-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Share2 className="h-5 w-5 text-slate-700" />
        </Button>
      </div>

    </div>
  );
}
