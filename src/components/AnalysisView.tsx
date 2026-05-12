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
  Activity
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
      title: "Generating Elite Report", 
      description: "Compiling high-fidelity genomic documentation..." 
    });

    try {
      // Ensure element is temporarily visible for capture
      const originalStyle = element.style.cssText;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.display = 'block';

      // Create high-res canvas with specific production flags
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      // Restore original style
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
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

      // Handle Multi-page logic cleanly
      while (heightLeft > 0) {
        position = heightLeft - canvasHeightInPDF;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInPDF);
        heightLeft -= pdfHeight;
      }

      pdf.save(`BovIntelligence_Report_${result.id}.pdf`);
      toast({ title: "Report Downloaded", description: "Elite diagnostic documentation saved successfully." });
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
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
      
      {/* Print-optimized layout (Burp Suite Style Elite Diagnostic) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', pointerEvents: 'none' }}>
        <div id="report-content" className="bg-white p-[15mm] space-y-8 text-slate-900" style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center">
                <Fingerprint className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter leading-none">BovIntelligence AI</h1>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Livestock Genomics Diagnostic Laboratory</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Reference</p>
              <p className="text-md font-black tracking-tight text-slate-900">#{result.id}</p>
              <p className="text-[9px] text-slate-500 font-medium mt-1">{new Date(result.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Identification Section */}
          <div className="grid grid-cols-[1fr_2fr] gap-8 items-center p-6 bg-slate-50 rounded-2xl border border-slate-100" style={{ pageBreakInside: 'avoid' }}>
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white">
              <img src={result.photoDataUri} alt={result.breedName} className="object-cover w-full h-full" />
            </div>
            <div className="space-y-3">
              <div className="inline-block bg-slate-900 text-white text-[8px] uppercase px-2 py-0.5 font-black rounded">
                {result.confidence} Genomic Confidence
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{result.breedName}</h2>
              <div className="h-1 w-12 bg-orange-500 rounded-full" />
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">
                "{result.diagnosticNote}"
              </p>
            </div>
          </div>

          {/* Detailed Genomic Traits Analysis */}
          <div className="space-y-6 pt-2">
            {[
              { label: 'Origin & Historical Genetic Heritage', value: traits.origin, icon: Microscope },
              { label: 'Production Metrics & Milk Quality Analysis', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Ecological Resilience & Environmental Adaptability', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Behavioral Ethology & Temperament Profile', value: traits.temperament, icon: HeartPulse },
              { label: 'Elite Morphological Conformation Standards', value: traits.physicalCharacteristics, icon: Scale }
            ].map((trait, i) => (
              <div key={i} className="space-y-2" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <trait.icon className="h-3.5 w-3.5 text-slate-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800">{trait.label}</h3>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-[1.7] text-justify font-normal">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>

          {/* Management Protocols */}
          <div className="grid grid-cols-2 gap-6 pt-4" style={{ pageBreakInside: 'avoid' }}>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-orange-500 rounded-full" /> Nutrition Protocol
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{result.careGuide?.nutritionTips}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> Health Protocol
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{result.careGuide?.healthTips}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-10 text-center border-t border-slate-100 mt-8">
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.4em]">
              Confidential Genomic Diagnostic Data • BovIntelligence AI Secure Ledger
            </p>
          </div>
        </div>
      </div>
      
      {/* Visual Analysis Grid for Screen */}
      <div className="space-y-6 px-2">
         <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl relative">
            <div className="relative aspect-video w-full">
               <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Identification</p>
                     <h2 className="text-3xl font-headline font-bold text-white leading-none">{result.breedName}</h2>
                  </div>
                  <Badge className="bg-accent text-white border-none px-4 py-1.5 rounded-full font-bold text-[10px] uppercase">
                     {result.confidence} Confidence
                  </Badge>
               </div>
            </div>
         </Card>

         <div className="grid gap-4">
            {[
              { title: 'Genomic Origin', value: traits.origin, icon: Microscope, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Production Profile', value: traits.milkYieldEstimates, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { title: 'Adaptability', value: traits.environmentalAdaptability, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' }
            ].map((item, i) => (
              <Card key={i} className="p-6 rounded-[2rem] border-slate-100 shadow-sm space-y-3">
                 <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                       <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-[#0F172A]">{item.title}</h3>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed text-justify line-clamp-4">{item.value}</p>
              </Card>
            ))}
         </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 px-2 sticky bottom-24 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-[1.5rem] h-14 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-xl active:scale-95 transition-all">
              <Download className="h-5 w-5" /> {isExporting ? 'Generating...' : 'Export Report'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-slate-100 shadow-2xl">
            <DropdownMenuItem 
              onClick={(e) => { e.preventDefault(); handleDownloadPDF(); }} 
              className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-accent" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">Download Elite PDF</span>
                <span className="text-[8px] text-slate-400 font-medium">Professional A4 Report</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Clinical Summary</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Export Raw Data (JSON)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleShare} variant="outline" className="h-14 w-14 rounded-[1.5rem] border-white/50 bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Share2 className="h-5 w-5 text-slate-700" />
        </Button>
      </div>

    </div>
  );
}