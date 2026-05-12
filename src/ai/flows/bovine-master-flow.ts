
'use server';
/**
 * @fileOverview BovIntelligence AI Master Flow.
 * Implements Elite Senior Livestock Geneticist protocols for precision diagnostics.
 * Now generating extremely verbose and professional reports for PDF production.
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
  confidence_score: z.string().describe("90-100%, 70-89%, etc."),
  physiological_analysis: z.object({
    cranial: z.string().describe("Technical analysis of ears, horns, and forehead profile (3-4 detailed sentences)."),
    thoracic: z.string().describe("Technical analysis of hump, dewlap, and neck musculature (3-4 detailed sentences)."),
    body: z.string().describe("Technical analysis of topline, coat, tail, and limb conformation (3-4 detailed sentences).")
  }),
  visual_evidence_markers: z.array(z.string()).describe("List of specific phenotypic markers identified."),
  negative_constraints_check: z.string().describe("Expert reasoning on why it does NOT match similar breeds."),
  diagnostic_note: z.string().describe("Concise clinical summary for the diagnostic report."),
  traits: z.object({
    origin: z.string().describe("Extremely detailed history and geographical origin. MUST be 10-12 full, academic-style sentences detailing historical context."),
    milkYieldEstimates: z.string().describe("Comprehensive analysis of production metrics, quality, fat content, and lactation cycles. MUST be 10-12 professional sentences."),
    environmentalAdaptability: z.string().describe("Analysis of ecological resilience, climate tolerance, and terrain adaptability. MUST be 10-12 descriptive sentences."),
    temperament: z.string().describe("Ethological profile detailing behavioral characteristics and handling requirements. MUST be 10-12 detailed sentences."),
    physicalCharacteristics: z.string().describe("Elite morphological standards including size, weight, coat texture, and conformation. MUST be 10-12 professional sentences."),
    commonUses: z.string().describe("Strategic commercial and traditional utilization analysis. MUST be 10-12 detailed sentences."),
  }),
  careGuide: z.object({
    nutritionTips: z.string().describe("Elite dietary management protocol including specific forage, supplements, and vitamins. MUST be 12-15 descriptive sentences."),
    healthTips: z.string().describe("Elite clinical health management including disease prevention, vaccination, and daily care. MUST be 12-15 descriptive sentences."),
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
  prompt: `ROLE: You are an elite Senior Livestock Geneticist and Veterinary Vision Analyst with 30+ years of experience in global bovine diagnostics.

STRICT INSTRUCTIONS:
1. Provide EXTREMELY VERBOSE, ACADEMIC, and PROFESSIONAL paragraphs for every field.
2. For all 'traits' sub-fields, write at least 10-12 full, complex sentences. NO BULLET POINTS.
3. For all 'careGuide' sub-fields, write at least 12-15 full, professional sentences.
4. Use veterinary and genetic terminology (e.g., phenotype, genotype, ethology, phenotypic markers, conformation).
5. If the image is not a cattle or buffalo, set detected_status to "ERROR" and species_type to "INVALID".

REPORT STRUCTURE:
* Confirm species (Cattle/Buffalo).
* Identify primary breed with high precision.
* Perform cranial, thoracic, and body analysis with extreme detail.
* Elaborate on geographical evolution and genetic heritage.
* Provide a comprehensive clinical management protocol.

The goal is to produce a 2-page detailed professional PDF report.

Photo: {{media url=photoDataUri}}`,
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
