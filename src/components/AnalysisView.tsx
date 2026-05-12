'use client';

import { ScanEntry } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Zap, 
  HeartPulse, 
  Share2,
  Microscope,
  Copy,
  FileJson,
  Dna,
  Scale,
  FileText,
  Fingerprint,
  Activity,
  History
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

// Production level PDF libraries
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
    downloadAnchorNode.setAttribute("download", `BovIntelligence_Data_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Data Exported", description: "JSON record secured." });
  };

  const handleCopyText = () => {
    const text = `
BovIntelligence AI - Diagnostic Summary
ID: ${result.id}
Breed: ${result.breedName}
Confidence: ${result.confidence}
Summary: ${result.diagnosticNote}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Clinical text copied to clipboard." });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsExporting(true);
    toast({ 
      title: "Compiling Elite Report", 
      description: "Generating production-grade genomic documentation..." 
    });

    try {
      // High fidelity capture for professional printing
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Standard A4 pixel width at 96 DPI
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalCanvasHeightInPDF = imgHeight * ratio;

      // Handle multi-page logically: if it fits on one page, keep it one page.
      if (totalCanvasHeightInPDF <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, totalCanvasHeightInPDF);
      } else {
        // Multi-page logic
        let heightLeft = totalCanvasHeightInPDF;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalCanvasHeightInPDF);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - totalCanvasHeightInPDF;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalCanvasHeightInPDF);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`BovIntelligence_Report_${result.id}.pdf`);
      toast({ title: "Report Secured", description: "Professional PDF saved to your system." });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({ 
        variant: "destructive", 
        title: "Export Failure", 
        description: "High-fidelity rendering failed. Please retry." 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const traits = result.traits;
  const analysis = result.physiologicalAnalysis;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      
      {/* Hidden for screen, optimized for High-Resolution PDF Capture */}
      <div id="report-content" className="bg-white p-10 rounded-none space-y-8 border-t-[8px] border-slate-900 shadow-none text-slate-900 leading-tight">
        
        {/* Elite Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 bg-slate-900 rounded-md flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">BovIntelligence <span className="text-accent">AI</span></h1>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Genomic Visual Diagnostic Report</p>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-bold text-slate-400 uppercase">Document Serial</p>
             <p className="text-sm font-bold tracking-tighter">#{result.id}</p>
             <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(result.timestamp).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Diagnostic Identification Section */}
        <div className="grid grid-cols-[1fr_2fr] gap-8 items-center bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[8px] font-bold text-accent uppercase tracking-widest mb-1">Primary Identification</p>
              <h2 className="text-2xl font-bold leading-none">{result.breedName}</h2>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-white border-slate-200 text-[8px] font-bold uppercase py-0.5">
                  Confidence: {result.confidence}
                </Badge>
                <Badge variant="outline" className="bg-white border-slate-200 text-[8px] font-bold uppercase py-0.5">
                  Type: {result.speciesType}
                </Badge>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Clinical Observation</p>
              <p className="text-[11px] text-slate-600 leading-relaxed italic font-medium">
                "{result.diagnosticNote}"
              </p>
            </div>
          </div>
        </div>

        {/* Core Analysis Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Dna className="h-4 w-4 text-slate-900" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Genomic Profile Analysis</h3>
          </div>
          
          <div className="grid gap-6">
            {[
              { label: 'Historical Genetic Heritage', value: traits.origin, icon: Microscope },
              { label: 'Production & Milk Quality Metrics', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Environmental Adaptation Profile', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Ethological & Temperament Assessment', value: traits.temperament, icon: HeartPulse }
            ].map((trait, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-2">
                   <trait.icon className="h-3 w-3 text-accent" />
                   <h4 className="text-[9px] font-bold uppercase text-slate-800">{trait.label}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed text-justify pl-5 border-l-2 border-slate-50">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conformation Analysis */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Scale className="h-4 w-4 text-slate-900" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Morphological Conformation</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
             <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1 uppercase text-[8px]">Cranial/Thoracic Evidence:</span>
                  {analysis.cranial} {analysis.thoracic}
                </p>
             </div>
             <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1 uppercase text-[8px]">Body Conformation Standards:</span>
                  {analysis.body}
                </p>
             </div>
          </div>
        </div>

        {/* Elite Management Protocol */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="h-4 w-4 text-slate-900" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Elite Management Protocols</h3>
          </div>
          <div className="grid gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-100 border-l-4 border-l-accent">
               <h3 className="text-[9px] font-bold uppercase mb-2">Nutritional Strategy</h3>
               <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.nutritionTips}</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-100 border-l-4 border-l-slate-900">
               <h3 className="text-[9px] font-bold uppercase mb-2">Health & Bio-Security Protocol</h3>
               <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.healthTips}</p>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="border-t border-slate-100 pt-6 mt-10 text-center">
           <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.15em]">Official BovIntelligence AI Laboratory Diagnostics</p>
           <p className="text-[7px] text-slate-300 mt-1 uppercase">Confidential Professional Document</p>
        </div>
      </div>
      
      {/* Action Navigation */}
      <div className="flex gap-3 px-2 print:hidden sticky bottom-24 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-[1.5rem] h-14 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-xl active:scale-95 transition-all">
              <Download className="h-5 w-5" /> {isExporting ? 'Processing Elite Report...' : 'Download Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={handleDownloadPDF} 
              className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-accent" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">Save Elite PDF</span>
                <span className="text-[8px] text-slate-400 font-medium">Production-grade documentation</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCopyText} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Summary</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExportJSON} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Export JSON Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="h-14 w-14 rounded-[1.5rem] border-white/50 bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Share2 className="h-5 w-5 text-slate-700" />
        </Button>
      </div>

    </div>
  );
}
