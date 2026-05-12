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

// Elite Production-Grade PDF Engine
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
          text: `Check out this bovine breed analysis for ${result.breedName}. Diagnostic ID: ${result.id}`,
          url: window.location.href,
        });
      } catch (err) {
        toast({ title: "Share Failed", description: "Unable to share at this time.", variant: "destructive" });
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
      description: "Processing high-fidelity genomic documentation..." 
    });

    try {
      // Temporarily make it visible for capture
      const originalStyle = element.style.cssText;
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.display = 'block';
      element.style.zIndex = '-9999';

      const canvas = await html2canvas(element, {
        scale: 2.5, // High DPI for production quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
      });

      // Restore original state
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const canvasHeightInPDF = imgHeight * ratio;

      let heightLeft = canvasHeightInPDF;
      let position = 0;

      // Add First Page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInPDF);
      heightLeft -= pdfHeight;

      // Handle subsequent pages with proper splitting logic
      while (heightLeft > 0) {
        position = heightLeft - canvasHeightInPDF;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInPDF);
        heightLeft -= pdfHeight;
      }

      pdf.save(`BovIntelligence_Elite_Report_${result.id}.pdf`);
      toast({ title: "Report Downloaded", description: "Professional documentation saved to your device." });
    } catch (error: any) {
      console.error('PDF Error:', error);
      toast({ 
        variant: "destructive", 
        title: "Export Failure", 
        description: "Encountered an error during high-fidelity rendering." 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const traits = result.traits;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      
      {/* ELITE PRODUCTION REPORT (HIDDEN FROM SCREEN, USED FOR PDF) */}
      <div style={{ display: 'none' }}>
        <div id="report-content" className="bg-white p-[20mm] space-y-10 text-slate-900" style={{ width: '210mm', minHeight: '297mm', position: 'relative' }}>
          
          {/* Official Diagnostic Header */}
          <div className="flex justify-between items-start border-b-[3px] border-slate-900 pb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Fingerprint className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight">BovIntelligence AI</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Elite Genomics Diagnostic Division</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-100 px-3 py-1 rounded text-[8px] font-bold mb-2 inline-block">CONFIDENTIAL REPORT</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DIAGNOSTIC ID</p>
              <p className="text-lg font-black tracking-tight text-slate-900">#{result.id}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">{new Date(result.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Primary Identification Panel */}
          <div className="grid grid-cols-[200px_1fr] gap-10 items-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
              <img src={result.photoDataUri} alt={result.breedName} className="object-cover w-full h-full" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className="bg-slate-900 text-white text-[8px] uppercase px-3 py-1 rounded-full font-black">
                   {result.confidence} GENOMIC CONFIDENCE
                </Badge>
                <Badge className="bg-orange-500 text-white text-[8px] uppercase px-3 py-1 rounded-full font-black">
                   PREMIUM DIAGNOSIS
                </Badge>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{result.breedName}</h2>
              <div className="h-1.5 w-16 bg-orange-500 rounded-full" />
              <p className="text-[12px] text-slate-700 leading-relaxed font-semibold italic">
                "{result.diagnosticNote}"
              </p>
            </div>
          </div>

          {/* Genomic Traits Deep Dive */}
          <div className="space-y-8">
            {[
              { label: 'Origin & Historical Genetic Heritage', value: traits.origin, icon: Microscope },
              { label: 'Production Metrics & Milk Quality Analysis', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Ecological Resilience & Environmental Adaptability', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Behavioral Ethology & Temperament Profile', value: traits.temperament, icon: HeartPulse },
              { label: 'Elite Morphological Conformation Standards', value: traits.physicalCharacteristics, icon: Scale }
            ].map((trait, i) => (
              <div key={i} className="space-y-3" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="h-6 w-6 rounded bg-slate-900 flex items-center justify-center">
                    <trait.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">{trait.label}</h3>
                </div>
                <p className="text-[12px] text-slate-600 leading-[1.8] text-justify font-medium">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>

          {/* Elite Management Protocols (Page 2 usually) */}
          <div className="pt-10 space-y-8" style={{ pageBreakBefore: 'auto' }}>
            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4" style={{ pageBreakInside: 'avoid' }}>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" /> NUTRITIONAL OPTIMIZATION PROTOCOL
               </h3>
               <p className="text-[12.5px] text-slate-300 leading-relaxed font-medium">{result.careGuide?.nutritionTips}</p>
            </div>
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-4" style={{ pageBreakInside: 'avoid' }}>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" /> CLINICAL HEALTH & MAINTENANCE PROTOCOL
               </h3>
               <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">{result.careGuide?.healthTips}</p>
            </div>
          </div>

          {/* Footer Ledger */}
          <div className="pt-12 text-center border-t border-slate-100 mt-12 opacity-50">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em]">
              CONFIDENTIAL • BOVINTELLIGENCE AI GENOMIC VAULT • SECURE RECORD
            </p>
          </div>
        </div>
      </div>
      
      {/* Visual UI for Screen */}
      <div className="space-y-6 px-2">
         <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl relative group">
            <div className="relative aspect-video w-full">
               <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Precision Identification</p>
                     <h2 className="text-3xl font-headline font-bold text-white leading-none">{result.breedName}</h2>
                  </div>
                  <Badge className="bg-accent text-white border-none px-4 py-2 rounded-full font-bold text-[10px] uppercase shadow-lg">
                     {result.confidence} Score
                  </Badge>
               </div>
            </div>
         </Card>

         <div className="grid gap-4">
            {[
              { title: 'Genomic History', value: traits.origin, icon: Microscope, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Production Metric', value: traits.milkYieldEstimates, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { title: 'Ecological Adapt', value: traits.environmentalAdaptability, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' }
            ].map((item, i) => (
              <Card key={i} className="p-6 rounded-[2rem] border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                       <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-lg text-[#0F172A]">{item.title}</h3>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed text-justify line-clamp-4 font-medium italic">"{item.value}"</p>
              </Card>
            ))}
         </div>
      </div>
      
      {/* Professional Actions */}
      <div className="flex gap-4 px-2 sticky bottom-24 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-[1.5rem] h-16 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.2em] gap-3 shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
              <Download className="h-6 w-6" /> {isExporting ? 'Processing Elite Data...' : 'Export Elite Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-[2rem] p-3 bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={(e) => { e.preventDefault(); handleDownloadPDF(); }} 
              className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50"
            >
              <FileText className="h-5 w-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Download Elite PDF</span>
                <span className="text-[9px] text-slate-400 font-bold">Scientific Lab Format (A4)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText} className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50">
              <Copy className="h-5 w-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Copy Summary</span>
                <span className="text-[9px] text-slate-400 font-bold">Clinical Text Snapshot</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} className="flex gap-4 py-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50">
              <FileJson className="h-5 w-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider">Raw Genomic Data</span>
                <span className="text-[9px] text-slate-400 font-bold">Export for Data Analysis</span>
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
