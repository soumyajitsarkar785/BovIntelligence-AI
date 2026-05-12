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
  FileText,
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
   * Captures the entire report as a high-resolution professional document.
   */
  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsExporting(true);
    toast({ 
      title: "Generating Elite Report", 
      description: "Compiling genomic diagnostics into professional PDF..." 
    });

    try {
      // Create high resolution canvas for pro print quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800, // Optimized for A4 aspect
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth;
      const canvasPageHeight = pdfHeight / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // Add cover page / first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight * ratio);
      heightLeft -= canvasPageHeight;

      // Handle multi-page if content is verbose
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight * ratio);
        heightLeft -= canvasPageHeight;
        pageNumber++;
      }

      pdf.save(`BovIntelligence_Elite_Report_${result.id}.pdf`);

      toast({ 
        title: "Download Complete", 
        description: "Elite diagnostic report secured in downloads." 
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({ 
        variant: "destructive", 
        title: "Export Failed", 
        description: "An error occurred during high-fidelity report generation." 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const analysis = result.physiologicalAnalysis || { cranial: 'N/A', thoracic: 'N/A', body: 'N/A' };
  const traits = result.traits;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Container for PDF Capture - STYLED FOR PROFESSIONAL PDF OUTPUT */}
      <div id="report-content" className="bg-white p-8 rounded-none space-y-8 border-t-[12px] border-accent shadow-none">
        
        {/* Professional Report Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">BovIntelligence <span className="text-accent">AI</span></h1>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Genomic Visual Diagnostic Report</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-slate-500 uppercase">Document Serial</p>
             <p className="text-sm font-black text-[#0F172A] tracking-tighter">#{result.id}</p>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(result.timestamp).toLocaleDateString()} | {new Date(result.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Visual Identification Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1">Identified Breed</p>
              <h2 className="text-3xl font-black text-[#0F172A] leading-tight">{result.breedName}</h2>
              <Badge className="mt-2 bg-emerald-500 hover:bg-emerald-600 border-none px-4 py-1 text-[10px] font-bold uppercase">
                Confidence: {result.confidence}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Clinical Summary</p>
              <p className="text-[12px] text-slate-700 leading-relaxed italic font-medium">
                "{result.diagnosticNote || "Diagnostic confirmation pending genomic validation."}"
              </p>
            </div>
          </div>
        </div>

        {/* Genomic Intelligence Section - VERBOSE PARAGRAPHS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Dna className="h-5 w-5 text-accent" />
            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Genomic Profile & Academic Traits</h3>
          </div>
          
          <div className="grid gap-6">
            {[
              { label: 'Origin & Historical Genetic Heritage', value: traits.origin, icon: Microscope },
              { label: 'Production Metrics & Milk Quality Analysis', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Ecological Resilience & Environmental Adaptability', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Behavioral Ethology & Temperament Profile', value: traits.temperament, icon: HeartPulse },
              { label: 'Elite Morphological Conformation Standards', value: traits.physicalCharacteristics, icon: Scale },
              { label: 'Strategic Commercial & Industrial Utilization', value: traits.commonUses, icon: FileText }
            ].map((trait, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                   <trait.icon className="h-3 w-3 text-accent" />
                   <h4 className="text-[10px] font-black uppercase text-[#0F172A]">{trait.label}</h4>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed text-justify pl-5 border-l border-slate-100">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Evidence Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
            <Scale className="h-4 w-4 text-accent" /> Morphological Evidence Analysis
          </h3>
          <div className="grid grid-cols-1 gap-4">
             {[
               { title: 'Cranial & Cephalic Conformation', data: analysis.cranial },
               { title: 'Thoracic & Muscular Conformation', data: analysis.thoracic },
               { title: 'Body Frame & Skeletal Conformation', data: analysis.body }
             ].map((item, idx) => (
               <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-bold uppercase text-accent mb-2">{item.title}</h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{item.data}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Management Protocols */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" /> Elite Veterinary Management Protocols
          </h3>
          <div className="grid gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border-l-8 border-orange-500">
               <h3 className="text-[11px] font-black text-[#0F172A] uppercase mb-2">Advanced Nutritional Strategy</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.nutritionTips}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border-l-8 border-red-500">
               <h3 className="text-[11px] font-black text-[#0F172A] uppercase mb-2">Clinical Health & Bio-Security Protocol</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.healthTips}</p>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-200 pt-8 mt-12 text-center space-y-2">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Generated by BovIntelligence AI Diagnostic Engine v1.2</p>
           <p className="text-[8px] text-slate-300 max-w-lg mx-auto leading-relaxed">
             Disclaimer: This report is generated based on visual genomic analysis and AI-driven morphological validation. It is intended for professional use only. Clinical verification by a certified veterinarian is recommended for final herd management decisions.
           </p>
        </div>
      </div>
      
      {/* Action Buttons (Excluded from PDF) */}
      <div className="flex gap-3 px-2 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-2xl h-14 bg-[#0F172A] text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-2xl active:scale-95 transition-transform">
              <Download className="h-5 w-5" /> {isExporting ? 'Generating Report...' : 'Export Professional Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={handleDownloadPDF} 
              className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50"
            >
              <FileText className="h-4 w-4 text-accent" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">Download Elite PDF</span>
                <span className="text-[8px] text-slate-400 font-medium">Production-grade diagnostic document</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCopyText} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Clinical Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExportJSON} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Export JSON Data</span>
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
