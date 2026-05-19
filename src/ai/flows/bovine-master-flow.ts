/**
 * @fileOverview BovIntelligence AI Elite Master Flow.
 * Implements a livestock vision analysis flow for app reports.
 * The caller passes scan preferences in the description context.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BovineMasterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe("A photo of a bovine animal as a data URI."),
  description: z.string().optional().describe('Optional user context or region.'),
});

const BovineMasterOutputSchema = z.object({
  detected_status: z.string().describe("SUCCESS or ERROR status."),
  species_type: z.string().describe("Cattle (bovine) or Buffalo (bubaline)."),
  primary_breed: z.string().describe("Identified breed name."),
  confidence_score: z.string().describe("Precision score (e.g., 98.5%)."),
  physiological_analysis: z.object({
    cranial: z.string().describe("Analysis of ears, horns, and forehead profile."),
    thoracic: z.string().describe("Analysis of hump, dewlap, and neck musculature."),
    body: z.string().describe("Analysis of topline, coat, tail, and limb conformation.")
  }),
  visual_evidence_markers: z.array(z.string()).describe("List of specific phenotypic markers identified."),
  negative_constraints_check: z.string().describe("Expert reasoning on why it does NOT match similar breeds."),
  diagnostic_note: z.string().describe("Clinical summary for the diagnostic report header."),
  traits: z.object({
    origin: z.string().describe("History and geographical origin adjusted to requested report depth."),
    milkYieldEstimates: z.string().describe("Production metrics and milk or yield potential adjusted to requested report depth."),
    environmentalAdaptability: z.string().describe("Climate, terrain, and ecological adaptability adjusted to requested report depth."),
    temperament: z.string().describe("Behavioral profile and handling notes adjusted to requested report depth."),
    physicalCharacteristics: z.string().describe("Morphological standards and visible physical characteristics adjusted to requested report depth."),
    commonUses: z.string().describe("Commercial and traditional utilization adjusted to requested report depth."),
  }),
  careGuide: z.object({
    nutritionTips: z.string().describe("Dietary management guidance adjusted to requested report depth."),
    healthTips: z.string().describe("Health management, disease prevention, and daily care adjusted to requested report depth."),
  }),
});

export type BovineMasterOutput = z.infer<typeof BovineMasterOutputSchema>;

export async function analyzeBovine(input: { photoDataUri: string, description?: string }): Promise<BovineMasterOutput> {
  return bovineMasterFlow(input);
}

const bovineMasterPrompt = ai.definePrompt({
  name: 'bovineMasterPrompt',
  input: {schema: BovineMasterInputSchema},
  output: {schema: BovineMasterOutputSchema},
  prompt: `ROLE: You are a senior livestock breed analyst and veterinary vision assistant.

STRICT INSTRUCTIONS:
1. Always return valid structured JSON matching the schema.
2. If the image is not a cattle or buffalo, set detected_status to "ERROR" and species_type to "INVALID".
3. Use the caller context below as operational instructions. It controls report language, analysis focus, region, life stage, and depth.
4. Report depth rules:
   - Standard: concise field-ready response, 2-4 sentences for each long text field.
   - Executive: balanced professional response, 5-8 sentences for each long text field.
   - Research: deeper technical response, 9-14 sentences for each long text field.
5. Analysis focus rules:
   - Breed ID: prioritize breed identity and visible phenotypic markers.
   - Dairy Yield: prioritize milk production, lactation, udder-related context when visible, and nutrition.
   - Meat Value: prioritize frame, musculature, body condition, and commercial use.
   - Breeding: prioritize reproduction, genetic suitability, temperament, and life stage.
   - Health Risk: prioritize visible risk markers, care guidance, and prevention.
6. Regional context should influence breed likelihood and care guidance, but do not invent certainty from location alone.

REPORT STRATEGY:
- Confirm species precisely (Cattle/Buffalo).
- Identify breed with maximum genomic precision.
- Explain visual evidence clearly.
- Keep the tone professional and useful for a livestock owner, farm operator, or veterinary worker.

Photo: {{media url=photoDataUri}}
Context: {{{description}}}`,
});

const bovineMasterFlow = ai.defineFlow(
  {
    name: 'bovineMasterFlow',
    inputSchema: BovineMasterInputSchema,
    outputSchema: BovineMasterOutputSchema,
  },
  async input => {
    const {output} = await bovineMasterPrompt(input);
    return output!;
  }
);
