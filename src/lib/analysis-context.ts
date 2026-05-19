import {
  ANALYSIS_FOCUS_OPTIONS,
  LIFE_STAGE_OPTIONS,
  REGION_OPTIONS,
  REPORT_DEPTH_OPTIONS,
  type AppSettings,
} from '@/lib/app-settings';
import { LANGUAGES } from '@/lib/i18n';

export function buildAnalysisContext(settings: AppSettings) {
  const language = LANGUAGES.find((item) => item.value === settings.language)?.label ?? 'English';
  const focus = ANALYSIS_FOCUS_OPTIONS.find((item) => item.value === settings.analysisFocus)?.label ?? 'Breed ID';
  const region = REGION_OPTIONS.find((item) => item.value === settings.regionContext)?.label ?? 'Auto Detect';
  const lifeStage = LIFE_STAGE_OPTIONS.find((item) => item.value === settings.lifeStage)?.label ?? 'Unknown';
  const reportDepth = REPORT_DEPTH_OPTIONS.find((item) => item.value === settings.reportDepth)?.label ?? 'Executive';

  return [
    settings.translatedReports ? `Return report content in ${language}.` : 'Return report content in English.',
    `Analysis focus: ${focus}.`,
    `Regional context: ${region}.`,
    `Animal life stage: ${lifeStage}.`,
    `Report depth: ${reportDepth}.`,
  ].join(' ');
}
