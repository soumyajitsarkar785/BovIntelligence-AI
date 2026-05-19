import type { AppLanguage } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

export const REPORT_DEPTH_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'executive', label: 'Executive' },
  { value: 'research', label: 'Research' },
] as const;

export const ANALYSIS_FOCUS_OPTIONS = [
  { value: 'general', label: 'Breed ID' },
  { value: 'dairy', label: 'Dairy Yield' },
  { value: 'beef', label: 'Meat Value' },
  { value: 'breeding', label: 'Breeding' },
  { value: 'health', label: 'Health Risk' },
] as const;

export const REGION_OPTIONS = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'india', label: 'India / South Asia' },
  { value: 'tropical', label: 'Tropical Climate' },
  { value: 'arid', label: 'Dry / Arid Zone' },
  { value: 'temperate', label: 'Temperate Zone' },
] as const;

export const LIFE_STAGE_OPTIONS = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'calf', label: 'Calf' },
  { value: 'heifer', label: 'Heifer' },
  { value: 'lactating', label: 'Lactating' },
  { value: 'breeding', label: 'Breeding Stock' },
  { value: 'adult', label: 'Adult' },
] as const;

export type ReportDepth = (typeof REPORT_DEPTH_OPTIONS)[number]['value'];
export type AnalysisFocus = (typeof ANALYSIS_FOCUS_OPTIONS)[number]['value'];
export type RegionContext = (typeof REGION_OPTIONS)[number]['value'];
export type LifeStage = (typeof LIFE_STAGE_OPTIONS)[number]['value'];

export interface AppSettings {
  language: AppLanguage;
  reportDepth: ReportDepth;
  analysisFocus: AnalysisFocus;
  regionContext: RegionContext;
  lifeStage: LifeStage;
  secureVault: boolean;
  translatedReports: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  language: 'en',
  reportDepth: 'executive',
  analysisFocus: 'general',
  regionContext: 'auto',
  lifeStage: 'unknown',
  secureVault: true,
  translatedReports: true,
};

const SETTINGS_KEY = 'bovintelligence_settings_v1';

function optionValue<T extends readonly { value: string }[]>(
  options: T,
  value: unknown,
  fallback: T[number]['value']
): T[number]['value'] {
  return typeof value === 'string' && options.some((option) => option.value === value)
    ? value as T[number]['value']
    : fallback;
}

export function normalizeAppSettings(input: Partial<AppSettings> | null | undefined): AppSettings {
  const data = input ?? {};

  return {
    language: optionValue(LANGUAGES, data.language, DEFAULT_APP_SETTINGS.language) as AppLanguage,
    reportDepth: optionValue(REPORT_DEPTH_OPTIONS, data.reportDepth, DEFAULT_APP_SETTINGS.reportDepth) as ReportDepth,
    analysisFocus: optionValue(ANALYSIS_FOCUS_OPTIONS, data.analysisFocus, DEFAULT_APP_SETTINGS.analysisFocus) as AnalysisFocus,
    regionContext: optionValue(REGION_OPTIONS, data.regionContext, DEFAULT_APP_SETTINGS.regionContext) as RegionContext,
    lifeStage: optionValue(LIFE_STAGE_OPTIONS, data.lifeStage, DEFAULT_APP_SETTINGS.lifeStage) as LifeStage,
    secureVault: typeof data.secureVault === 'boolean' ? data.secureVault : DEFAULT_APP_SETTINGS.secureVault,
    translatedReports: typeof data.translatedReports === 'boolean' ? data.translatedReports : DEFAULT_APP_SETTINGS.translatedReports,
  };
}

export function createSettingsSignature(settings: AppSettings) {
  return JSON.stringify({
    language: settings.translatedReports ? settings.language : 'en',
    reportDepth: settings.reportDepth,
    analysisFocus: settings.analysisFocus,
    regionContext: settings.regionContext,
    lifeStage: settings.lifeStage,
  });
}

export function readAppSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? normalizeAppSettings(JSON.parse(raw)) : DEFAULT_APP_SETTINGS;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function persistAppSettings(settings: AppSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
