'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  Camera,
  Database,
  History as HistoryIcon,
  LayoutDashboard,
  Settings as SettingsIcon,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScanLedger } from '@/components/ScanLedger';
import { AnalysisView } from '@/components/AnalysisView';
import { SettingsPanel } from '@/components/SettingsPanel';

import { requestBovineAnalysis } from '@/lib/analysis-api';
import { saveScan, ScanEntry, deleteScan, subscribeToHistory, findCachedScan } from '@/lib/storage';
import {
  ANALYSIS_FOCUS_OPTIONS,
  createSettingsSignature,
  DEFAULT_APP_SETTINGS,
  LIFE_STAGE_OPTIONS,
  persistAppSettings,
  REGION_OPTIONS,
  REPORT_DEPTH_OPTIONS,
  readAppSettings,
  type AppSettings,
} from '@/lib/app-settings';
import { uiCopy } from '@/lib/i18n';

const AppLogo = ({ subtitle }: { subtitle: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950">
      <ShieldCheck className="h-5 w-5 text-white" />
    </div>
    <div className="leading-none">
      <span className="block font-headline text-lg font-bold text-slate-950">BovIntelligence</span>
      <span className="mt-1 block text-xs font-semibold text-slate-500">{subtitle}</span>
    </div>
  </div>
);

export default function BreedClassifierApp() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'ledger' | 'settings'>('home');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const t = uiCopy[settings.language];
  const navItems = [
    { key: 'home' as const, label: t.nav.home, icon: LayoutDashboard },
    { key: 'ledger' as const, label: t.nav.bank, icon: HistoryIcon },
    { key: 'settings' as const, label: t.nav.settings, icon: SettingsIcon },
  ];
  const scanSummary = [
    ANALYSIS_FOCUS_OPTIONS.find((item) => item.value === settings.analysisFocus)?.label,
    REGION_OPTIONS.find((item) => item.value === settings.regionContext)?.label,
    LIFE_STAGE_OPTIONS.find((item) => item.value === settings.lifeStage)?.label,
    REPORT_DEPTH_OPTIONS.find((item) => item.value === settings.reportDepth)?.label,
  ].filter(Boolean);

  const resetScan = () => {
    setPhoto(null);
    setResult(null);
    setIsScanning(false);
    setScanProgress(0);
    setLoadingStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    setSettings(readAppSettings());
    const unsubscribe = subscribeToHistory((data) => {
      setHistory(data);
    });
    return () => unsubscribe();
  }, []);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      persistAppSettings(next);
      return next;
    });
  };

  const openTab = (tab: 'home' | 'ledger' | 'settings') => {
    setActiveTab(tab);
    resetScan();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onerror = () => {
        resetScan();
        toast({
          title: t.toast.uploadFailedTitle,
          description: t.toast.uploadFailedDescription,
          variant: "destructive"
        });
      };
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPhoto(dataUri);
        setResult(null);
        processImage(dataUri);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const processImage = async (dataUri: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // SMART CACHE (Learning Mechanism)
    // Check if this image was scanned before to save API Quota
    const settingsSignature = createSettingsSignature(settings);
    const cachedResult = settings.secureVault ? findCachedScan(dataUri, settingsSignature) : null;
    if (cachedResult) {
      setLoadingStep(t.loading.cached);
      setScanProgress(50);
      setTimeout(() => {
        setScanProgress(100);
        setResult(cachedResult);
        setIsScanning(false);
        toast({ title: t.toast.instantTitle, description: t.toast.instantDescription });
      }, 1000);
      return;
    }

    try {
      setLoadingStep(t.loading.validation);
      setScanProgress(20);
      const analysis = await requestBovineAnalysis(dataUri, settings);
      
      if (analysis.detected_status === "ERROR") {
        toast({
          title: t.toast.failureTitle,
          description: analysis.diagnostic_note || "Insufficient visual data for professional diagnosis.",
          variant: "destructive"
        });
        resetScan();
        return;
      }

      setScanProgress(70);
      setLoadingStep(t.loading.analysis);

      const entry: Omit<ScanEntry, 'timestamp'> = {
        id: `BI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        settingsSignature,
        photoDataUri: dataUri,
        breedName: analysis.primary_breed,
        confidence: analysis.confidence_score,
        speciesType: analysis.species_type,
        detectedStatus: analysis.detected_status,
        physiologicalAnalysis: analysis.physiological_analysis,
        visualMarkers: analysis.visual_evidence_markers || [],
        negativeConstraints: analysis.negative_constraints_check,
        diagnosticNote: analysis.diagnostic_note,
        traits: analysis.traits,
        careGuide: analysis.careGuide
      };

      setTimeout(() => {
        setScanProgress(100);
        if (settings.secureVault) {
          saveScan(entry);
        }
        setResult({ ...entry, timestamp: Date.now() });
        setIsScanning(false);
        toast({
          title: t.toast.completeTitle,
          description: settings.secureVault ? t.toast.completeDescription : t.toast.completeNoVaultDescription
        });
      }, 800);

    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: number }).status
        : undefined;
      const isQuotaError = message.includes('429') || status === 429 || message.toLowerCase().includes('quota');
      
      toast({
        title: isQuotaError ? t.toast.quotaTitle : t.toast.diagnosticTitle,
        description: isQuotaError 
          ? t.toast.quotaDescription 
          : t.toast.diagnosticDescription,
        variant: isQuotaError ? "default" : "destructive"
      });
      resetScan();
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteScan(id);
    if (result?.id === id) {
      resetScan();
    }
    toast({ title: t.toast.deleteTitle, description: t.toast.deleteDescription });
  };

  return (
    <div className="min-h-screen bg-slate-200 font-body text-slate-950">
      <div className="relative mx-auto min-h-screen w-full max-w-md bg-slate-50 pb-24 shadow-2xl">
        <Toaster />

        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3">
            {result || photo ? (
              <Button variant="outline" size="sm" onClick={resetScan} className="h-10 rounded-md border-slate-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <AppLogo subtitle={t.brandSubtitle} />
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t.home.primaryAction}
              className="h-10 w-10 rounded-md border-slate-200"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="px-4 py-4">
          {isScanning ? (
            <section className="space-y-4">
              <Card className="overflow-hidden rounded-lg border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                  {photo && <Image src={photo} alt="Scanning" fill className="object-cover brightness-75" />}
                  <div className="scan-line" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-700">{loadingStep || t.loading.validation}</p>
                    <span className="text-sm font-bold text-slate-950">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-slate-100" />
                </div>
              </Card>
            </section>
          ) : result ? (
            <AnalysisView result={result} language={settings.language} />
          ) : activeTab === 'ledger' ? (
            <section className="space-y-4 animate-in fade-in">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="font-headline text-2xl font-bold text-slate-950">{t.genomicVault}</h1>
                  <p className="text-sm font-semibold text-slate-500">{history.length} {t.professionalRecords}</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} className="h-10 rounded-md bg-slate-950 text-white hover:bg-slate-800">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan
                </Button>
              </div>
              <ScanLedger history={history} onSelect={(e) => { setPhoto(e.photoDataUri); setResult(e); }} onDelete={handleDeleteEntry} />
            </section>
          ) : activeTab === 'settings' ? (
            <SettingsPanel
              settings={settings}
              onChange={updateSettings}
            />
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <section className="rounded-lg bg-slate-950 p-5 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">{t.home.eyebrow}</p>
                <h1 className="mt-3 font-headline text-3xl font-bold leading-tight">{t.home.title}</h1>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-300">{t.home.subtitle}</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => fileInputRef.current?.click()} className="h-11 rounded-md bg-accent px-5 text-white hover:bg-accent/90">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {t.home.primaryAction}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('ledger')} className="h-11 rounded-md border-white/20 bg-white/10 px-5 text-white hover:bg-white/15">
                    <Database className="mr-2 h-4 w-4" />
                    {t.home.recordsAction}
                  </Button>
                </div>
              </section>

              <Card className="rounded-lg border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-slate-950">{t.home.preferences}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('settings')} className="h-8 rounded-md px-2 text-xs">
                    {t.nav.settings}
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scanSummary.map((item) => (
                    <span key={item} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>

              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-headline text-xl font-bold text-slate-950">{t.recentAnalysis}</h2>
                  {history.length > 0 && (
                    <Button variant="ghost" onClick={() => setActiveTab('ledger')} className="h-9 rounded-md px-2 text-slate-700">
                      {t.viewBank}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                    {history.slice(0, 3).map((scan) => (
                      <button
                        key={scan.id}
                        type="button"
                        onClick={() => { setPhoto(scan.photoDataUri); setResult(scan); }}
                        className="grid w-full grid-cols-[48px_1fr_auto] items-center gap-3 p-3 text-left transition-colors hover:bg-slate-50"
                      >
                        <span className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                          <Image src={scan.photoDataUri} alt={scan.breedName} fill className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-slate-950">{scan.breedName}</span>
                          <span className="mt-1 block text-xs font-semibold text-slate-500">#{scan.id}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-600">{scan.confidence}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
                    <Database className="mx-auto h-8 w-8 text-slate-300" />
                    <h3 className="mt-4 text-base font-bold text-slate-950">{t.home.recentEmpty}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{t.home.recentEmptyHint}</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 z-50 grid h-20 w-full max-w-md -translate-x-1/2 grid-cols-4 border-t border-slate-200 bg-white px-3 pb-3 pt-2 print:hidden">
          {navItems.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              onClick={() => openTab(key)}
              className={`h-full rounded-md px-2 ${activeTab === key ? 'text-accent' : 'text-slate-400'}`}
            >
              <span className="flex flex-col items-center gap-1">
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-bold">{label}</span>
              </span>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="h-full rounded-md px-2 text-slate-400"
          >
            <span className="flex flex-col items-center gap-1">
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-bold">Scan</span>
            </span>
          </Button>
        </nav>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
