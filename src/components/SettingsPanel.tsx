'use client';

import { Beef, Languages, ScanSearch, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  ANALYSIS_FOCUS_OPTIONS,
  LIFE_STAGE_OPTIONS,
  REGION_OPTIONS,
  REPORT_DEPTH_OPTIONS,
  type AnalysisFocus,
  type AppSettings,
  type LifeStage,
  type RegionContext,
  type ReportDepth,
} from '@/lib/app-settings';
import { LANGUAGES, type AppLanguage, uiCopy } from '@/lib/i18n';

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (settings: Partial<AppSettings>) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const t = uiCopy[settings.language];

  return (
    <div className="space-y-4 pb-4 animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-headline text-xl font-bold text-slate-950">{t.settings.title}</h2>
          <p className="text-xs font-semibold leading-snug text-slate-500">{t.settings.subtitle}</p>
        </div>
      </div>

      <Card className="space-y-4 rounded-lg border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
            <ScanSearch className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">{t.settings.scanProfile}</h3>
            <p className="text-xs text-slate-500">{t.settings.scanProfileHint}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">{t.settings.analysisFocus}</Label>
            <Select value={settings.analysisFocus} onValueChange={(value) => onChange({ analysisFocus: value as AnalysisFocus })}>
              <SelectTrigger className="h-11 rounded-md border-slate-200 bg-slate-50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANALYSIS_FOCUS_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">{t.settings.reportDepth}</Label>
            <Select value={settings.reportDepth} onValueChange={(value) => onChange({ reportDepth: value as ReportDepth })}>
              <SelectTrigger className="h-11 rounded-md border-slate-200 bg-slate-50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_DEPTH_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 rounded-lg border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <Beef className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">{t.settings.animalContext}</h3>
            <p className="text-xs text-slate-500">{t.settings.animalContextHint}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">{t.settings.region}</Label>
            <Select value={settings.regionContext} onValueChange={(value) => onChange({ regionContext: value as RegionContext })}>
              <SelectTrigger className="h-11 rounded-md border-slate-200 bg-slate-50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">{t.settings.lifeStage}</Label>
            <Select value={settings.lifeStage} onValueChange={(value) => onChange({ lifeStage: value as LifeStage })}>
              <SelectTrigger className="h-11 rounded-md border-slate-200 bg-slate-50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIFE_STAGE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="space-y-5 rounded-lg border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Languages className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <Label className="text-sm font-bold text-slate-950">{t.settings.language}</Label>
              <p className="text-xs leading-5 text-slate-500">{t.settings.languageHint}</p>
            </div>
            <Select value={settings.language} onValueChange={(value) => onChange({ language: value as AppLanguage })}>
              <SelectTrigger className="h-11 rounded-md border-slate-200 bg-slate-50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 rounded-lg border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-sm font-bold text-slate-950">{t.settings.secureVault}</Label>
                <p className="text-xs leading-5 text-slate-500">{t.settings.secureVaultHint}</p>
              </div>
              <Switch checked={settings.secureVault} onCheckedChange={(secureVault) => onChange({ secureVault })} />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-4">
              <div>
                <Label className="text-sm font-bold text-slate-950">{t.settings.translatedReports}</Label>
                <p className="text-xs leading-5 text-slate-500">{t.settings.translatedReportsHint}</p>
              </div>
              <Switch
                checked={settings.translatedReports}
                onCheckedChange={(translatedReports) => onChange({ translatedReports })}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
