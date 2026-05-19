import type { BovineMasterOutput } from '@/ai/flows/bovine-master-flow';
import type { AppSettings } from '@/lib/app-settings';

type AnalysisApiResponse =
  | { ok: true; data: BovineMasterOutput }
  | { ok: false; error: string };

export async function requestBovineAnalysis(
  photoDataUri: string,
  settings: AppSettings
): Promise<BovineMasterOutput> {
  const response = await fetch('/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoDataUri, settings }),
  });
  const payload = await response.json().catch(() => null) as AnalysisApiResponse | null;

  if (!response.ok || !payload?.ok) {
    const error = new Error(payload?.ok === false ? payload.error : 'Analysis backend failed.');
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return payload.data;
}
