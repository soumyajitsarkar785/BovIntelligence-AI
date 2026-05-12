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

  const handleShare = async () => {
    if (navigator.share) {
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
      // Create a high-quality capture of the element
      const canvas = await html2canvas(element, {
        scale: 3, // Increased scale for crisp production-level output
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('report-content');
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.position = 'static';
            clonedElement.style.width = '210mm'; // Force A4 width during capture
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalCanvasHeightInPDF = imgHeight * ratio;

      // Handle pagination properly for Burp Suite style multi-page reports
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

      pdf.save(`BovIntelligence_Report_${result.id}.pdf`);
      toast({ title: "Report Downloaded", description: "Elite diagnostic documentation saved successfully." });
    } catch (error) {
      console.error('PDF Generation Error:', error);
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
  const analysis = result.physiologicalAnalysis;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      
      {/* Hidden for screen, optimized for High-Resolution A4 PDF Capture (Production Grade) */}
      <div id="report-content" className="bg-white p-[25mm] space-y-10 border-t-[12px] border-slate-900 text-slate-900 hidden print:block" style={{ width: '210mm', minHeight: '297mm' }}>
        
        {/* Elite Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">BovIntelligence <span className="text-accent">AI</span></h1>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Genomic Visual Diagnostic Report</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-slate-400 uppercase">Document Serial</p>
             <p className="text-lg font-bold tracking-tighter">#{result.id}</p>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(result.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Diagnostic Identification Section */}
        <div className="grid grid-cols-[1fr_2.5fr] gap-10 items-center bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <Image src={result.photoDataUri} alt={result.breedName} fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-2">Primary Identification</p>
              <h2 className="text-3xl font-bold leading-none">{result.breedName}</h2>
              <div className="mt-3 flex gap-3">
                <Badge variant="outline" className="bg-white border-slate-200 text-[9px] font-bold uppercase py-1 px-3">
                  Confidence: {result.confidence}
                </Badge>
                <Badge variant="outline" className="bg-white border-slate-200 text-[9px] font-bold uppercase py-1 px-3">
                  Type: {result.speciesType}
                </Badge>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Clinical Observation</p>
              <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                "{result.diagnosticNote}"
              </p>
            </div>
          </div>
        </div>

        {/* Core Analysis Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3">
            <Dna className="h-5 w-5 text-slate-900" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Genomic Profile Analysis</h3>
          </div>
          
          <div className="grid gap-8">
            {[
              { label: 'Origin & Historical Genetic Heritage', value: traits.origin, icon: Microscope },
              { label: 'Production Metrics & Milk Quality Analysis', value: traits.milkYieldEstimates, icon: Activity },
              { label: 'Ecological Resilience & Environmental Adaptability', value: traits.environmentalAdaptability, icon: Zap },
              { label: 'Behavioral Ethology & Temperament Profile', value: traits.temperament, icon: HeartPulse },
              { label: 'Elite Morphological Conformation Standards', value: traits.physicalCharacteristics, icon: Scale }
            ].map((trait, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                   <trait.icon className="h-4 w-4 text-accent" />
                   <h4 className="text-[10px] font-bold uppercase text-slate-800 tracking-wide">{trait.label}</h4>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed text-justify pl-7 border-l-2 border-slate-50">
                  {trait.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Elite Management Protocol */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-slate-900" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Elite Management Protocols</h3>
          </div>
          <div className="grid gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 border-l-[6px] border-l-accent shadow-sm">
               <h3 className="text-[10px] font-bold uppercase mb-3 tracking-wider">Nutritional Strategy</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.nutritionTips}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 border-l-[6px] border-l-slate-900 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase mb-3 tracking-wider">Health & Bio-Security Protocol</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed text-justify">{result.careGuide?.healthTips}</p>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="border-t-2 border-slate-100 pt-8 mt-12 text-center">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">Official BovIntelligence AI Laboratory Diagnostics</p>
           <p className="text-[8px] text-slate-300 mt-2 uppercase">Confidential Professional Document • Internal Serial: BI-SYS-{result.id}</p>
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
      
      {/* Action Navigation */}
      <div className="flex gap-3 px-2 print:hidden sticky bottom-24 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} className="flex-1 rounded-[1.5rem] h-14 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-xl active:scale-95 transition-all">
              <Download className="h-5 w-5" /> {isExporting ? 'Generating Report...' : 'Export Report'}
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
                <span className="text-[8px] text-slate-400 font-medium">Production-grade document</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <Copy className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Copy Clinical Summary</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} className="flex gap-3 py-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <FileJson className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase">Export Raw JSON</span>
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
