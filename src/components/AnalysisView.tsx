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
  Copy,
  FileJson,
  Scale,
  FileText,
  Fingerprint,
  Activity,
  History,
  ShieldCheck
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

// Production-Grade PDF Engines
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

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `BovIntelligence AI Report - ${result.breedName}`,
          text: `Bovine Analysis for ${result.breedName}. ID: ${result.id}`,
          url: window.location.href,
        });
      } catch (err) {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsExporting(true);
    toast({ 
      title: "Elite Export Initialized", 
      description: "Generating high-fidelity genomic documentation..." 
    });

    try {
      // Step 1: Force visibility for capture
      const originalStyle = element.style.cssText;
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.top = '-10000px'; // Off-screen but in DOM
      element.style.left = '0';
      element.style.width = '210mm'; 
      element.style.backgroundColor = 'white';
      element.style.visibility = 'visible';

      // Small delay to allow reflow
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // 210mm at 96dpi
      });

      // Restore style
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = Number(pdf.internal.pageSize.getWidth());
      const pdfHeight = Number(pdf.internal.pageSize.getHeight());
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const canvasHeightInPDF = (imgHeight * pdfWidth) / imgWidth;

      // Robust validation
      if (!isFinite(pdfWidth) || !isFinite(canvasHeightInPDF) || canvasHeightInPDF <= 0) {
        throw new Error('Invalid dimensions calculated for PDF');
      }

      let heightLeft = canvasHeightInPDF;
      let position = 0;

      // Add First Page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInPDF, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Subsequent Pages Logic
      while (heightLeft > 0) {
        position = heightLeft - canvasHeightInPDF;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInPDF, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`BovIntelligence_Elite_Report_${result.id}.pdf`);
      toast({ title: "Report Downloaded", description: "Professional documentation saved." });
    } catch (error: any) {
      console.error('PDF Export Error:', error);
      toast({ 
        variant: "destructive", 
        title: "Export Failure", 
        description: error.message || "Encountered an error during high-fidelity rendering." 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const traits = result.traits;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      
      {/* ELITE PRODUCTION REPORT (FOR PDF CAPTURE) */}
      <div id="report-content" className="bg-white p-[20mm] space-y-10 text-slate-900 hidden print:block" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'serif' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-slate-900 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">BovIntelligence AI</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Genomics Diagnostic Division</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RECORD ID</p>
              <p className="text-xl font-bold">#{result.id}</p>
              <p className="text-[10px] text-slate-500 font-medium">{new Date(result.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Intro Section */}
          <div className="flex gap-10 items-start p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative h-48 w-48 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 border-4 border-white">
              <img src={result.photoDataUri} alt={result.breedName} className="object-cover w-full h-full" />
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-slate-900 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase">
                {result.confidence} CONFIDENCE PROTOCOL
              </div>
              <h2 className="text-4xl font-bold text-slate-900">{result.breedName}</h2>
              <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic border-l-4 border-slate-200 pl-4">
                "{result.diagnosticNote}"
              </p>
            </div>
          </div>

          {/* Diagnostic Content */}
          <div className="space-y-10">
            {[
              { label: 'Origin & Historical Evolution', value: traits.origin, icon: Microscope },
              { label: 'Genetic Production Potential', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Climatic Resilience & Adaptability', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Ethological Profile & Behavior', value: traits.temperament, icon: HeartPulse },
              { label: 'Elite Morphological Standards', value: traits.physicalCharacteristics, icon: Scale }
            ].map((trait, i) => (
              <div key={i} className="space-y-4" style={{ pageBreakInside: 'avoid' }}>
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-100 pb-2 flex items-center gap-3">
                  <trait.icon className="h-4 w-4 text-slate-400" /> {trait.label}
                </h3>
                <p className="text-[12px] text-slate-700 leading-relaxed text-justify">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>

          {/* Technical Care Protocols */}
          <div className="pt-10 space-y-8">
            <div className="p-8 bg-slate-900 text-white rounded-3xl" style={{ pageBreakInside: 'avoid' }}>
               <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Nutritional Optimization Protocol</h3>
               <p className="text-[12px] text-slate-300 leading-relaxed text-justify">{result.careGuide?.nutritionTips}</p>
            </div>
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl" style={{ pageBreakInside: 'avoid' }}>
               <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-slate-900 border-b border-slate-200 pb-2">Clinical Health Maintenance</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.healthTips}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-12 text-center border-t border-slate-100">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.5em]">
              CONFIDENTIAL • BOVINTELLIGENCE AI GENOMIC VAULT
            </p>
          </div>
      </div>
      
      {/* Visual UI for Screen */}
      <div className="space-y-6 px-2">
         <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl relative">
            <div className="relative aspect-video w-full">
               <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-accent uppercase tracking-widest">AI Identification</p>
                     <h2 className="text-3xl font-headline font-bold text-white leading-none">{result.breedName}</h2>
                  </div>
                  <Badge className="bg-accent text-white border-none px-4 py-2 rounded-full font-bold text-[10px] uppercase shadow-lg">
                     {result.confidence}
                  </Badge>
               </div>
            </div>
         </Card>

         <div className="grid gap-4">
            <Card className="p-6 rounded-[2rem] border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Microscope className="h-5 w-5 text-blue-500" />
                 </div>
                 <h3 className="font-bold text-lg text-[#0F172A]">Origin & Heritage</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 italic">"{traits.origin}"</p>
            </Card>
            
            <Card className="p-6 rounded-[2rem] border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-500" />
                 </div>
                 <h3 className="font-bold text-lg text-[#0F172A]">Yield Estimates</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 italic">"{traits.milkYieldEstimates}"</p>
            </Card>
         </div>
      </div>
      
      {/* Professional Actions */}
      <div className="flex gap-4 px-2 sticky bottom-24 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-[1.5rem] h-16 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.2em] gap-3 shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
              <Download className="h-6 w-6" /> {isExporting ? 'Processing...' : 'Export Elite Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-[2rem] p-3 bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={(e) => { e.preventDefault(); handleDownloadPDF(); }} 
              className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
            >
              <FileText className="h-5 w-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Download Elite PDF</span>
                <span className="text-[9px] text-slate-400 font-bold">Scientific Lab Format (A4)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText} className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50">
              <Copy className="h-5 w-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Copy Summary</span>
                <span className="text-[9px] text-slate-400 font-bold">Clinical Text Snapshot</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50">
              <FileJson className="h-5 w-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Raw Genomic Data</span>
                <span className="text-[9px] text-slate-400 font-bold">For Data Analysis</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleShare} variant="outline" className="h-16 w-16 rounded-[1.5rem] border-white bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-white transition-all active:scale-90">
          <Share2 className="h-6 w-6 text-slate-700" />
        </Button>
      </div>

    </div>
  );
}
