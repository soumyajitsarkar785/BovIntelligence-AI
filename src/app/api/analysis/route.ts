import { NextResponse } from 'next/server';
import { analyzeBovine } from '@/ai/flows/bovine-master-flow';
import { buildAnalysisContext } from '@/lib/analysis-context';
import { normalizeAppSettings } from '@/lib/app-settings';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const photoDataUri = body?.photoDataUri;

    if (typeof photoDataUri !== 'string' || !photoDataUri.startsWith('data:image/')) {
      return NextResponse.json(
        { ok: false, error: 'A valid image data URI is required.' },
        { status: 400 }
      );
    }

    const settings = normalizeAppSettings(body?.settings);
    const description = buildAnalysisContext(settings);

    const data = await analyzeBovine({
      photoDataUri,
      description,
    });

    // Defensive normalization so the UI never crashes on missing model fields
    // UI expects:
    // - physiological_analysis -> physiologicalAnalysis
    // - negative_constraints_check -> negativeConstraints
    // - traits.* and careGuide.* exact sub-keys
    const normalized = {
      detected_status: data?.detected_status ?? 'ERROR',
      species_type: data?.species_type ?? 'INVALID',
      primary_breed: data?.primary_breed ?? 'Unknown',
      confidence_score: data?.confidence_score ?? '0%',
      physiological_analysis: {
        cranial: data?.physiological_analysis?.cranial ?? '',
        thoracic: data?.physiological_analysis?.thoracic ?? '',
        body: data?.physiological_analysis?.body ?? '',
      },
      visual_evidence_markers: Array.isArray(data?.visual_evidence_markers)
        ? data.visual_evidence_markers
        : [],
      negative_constraints_check: data?.negative_constraints_check ?? '',
      diagnostic_note: data?.diagnostic_note ?? '',
      traits: {
        origin: data?.traits?.origin ?? '',
        milkYieldEstimates: data?.traits?.milkYieldEstimates ?? '',
        environmentalAdaptability: data?.traits?.environmentalAdaptability ?? '',
        temperament: data?.traits?.temperament ?? '',
        physicalCharacteristics: data?.traits?.physicalCharacteristics ?? '',
        commonUses: data?.traits?.commonUses ?? '',
      },
      careGuide: {
        nutritionTips: data?.careGuide?.nutritionTips ?? '',
        healthTips: data?.careGuide?.healthTips ?? '',
      },
    };

    return NextResponse.json({ ok: true, data: normalized });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis service failed.';
    const status = message.includes('429') || message.toLowerCase().includes('quota') ? 429 : 500;

    return NextResponse.json(
      { ok: false, error: message },
      { status }
    );
  }
}
