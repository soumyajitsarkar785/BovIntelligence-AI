'use server';
/**
 * @fileOverview BovIntelligence AI Elite Master Flow.
 * Implements Senior Livestock Geneticist protocols for high-precision, academic-level diagnostics.
 * Generates extremely verbose and professional reports for production-grade documentation.
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
    cranial: z.string().describe("Academic analysis of ears, horns, and forehead profile (5-7 detailed sentences)."),
    thoracic: z.string().describe("Technical analysis of hump, dewlap, and neck musculature (5-7 detailed sentences)."),
    body: z.string().describe("Technical analysis of topline, coat, tail, and limb conformation (5-7 detailed sentences).")
  }),
  visual_evidence_markers: z.array(z.string()).describe("List of specific phenotypic markers identified."),
  negative_constraints_check: z.string().describe("Expert reasoning on why it does NOT match similar breeds."),
  diagnostic_note: z.string().describe("Clinical summary for the diagnostic report header."),
  traits: z.object({
    origin: z.string().describe("Extremely detailed history and geographical origin. MUST be at least 15-20 full, academic-style sentences detailing historical context and evolutionary lineage."),
    milkYieldEstimates: z.string().describe("Comprehensive analysis of production metrics, quality, fat content, and lactation cycles. MUST be at least 15-20 professional sentences with scientific depth."),
    environmentalAdaptability: z.string().describe("Analysis of ecological resilience, climate tolerance, and terrain adaptability. MUST be 15-20 descriptive sentences covering thermal stress and forage efficiency."),
    temperament: z.string().describe("Ethological profile detailing behavioral characteristics and handling requirements. MUST be 15-20 detailed sentences using veterinary behavioral terminology."),
    physicalCharacteristics: z.string().describe("Elite morphological standards including size, weight, coat texture, and conformation. MUST be 15-20 professional sentences on somatic features."),
    commonUses: z.string().describe("Strategic commercial and traditional utilization analysis. MUST be 15-20 detailed sentences covering dual-purpose and specialized industrial applications."),
  }),
  careGuide: z.object({
    nutritionTips: z.string().describe("Elite dietary management protocol including specific forage, supplements, and vitamins. MUST be 20-25 descriptive sentences in clinical style."),
    healthTips: z.string().describe("Elite clinical health management including disease prevention, vaccination, and daily care. MUST be 20-25 descriptive sentences in clinical style."),
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
  prompt: `ROLE: You are an elite Senior Livestock Geneticist and Veterinary Vision Analyst with 40+ years of experience in global bovine diagnostics.

STRICT INSTRUCTIONS:
1. Provide EXTREMELY VERBOSE, ACADEMIC, and PROFESSIONAL paragraphs for every field.
2. For all 'traits' sub-fields, write at least 15-20 full, complex sentences. NO BULLET POINTS. Use professional, clinical language.
3. For all 'careGuide' sub-fields, write at least 20-25 full, professional sentences in a clinical tone.
4. Use veterinary and genetic terminology (e.g., phenotype, genotype, ethology, phenotypic markers, conformation, somatic traits, thermoregulation, phylogenetic lineage).
5. If the image is not a cattle or buffalo, set detected_status to "ERROR" and species_type to "INVALID".

REPORT STRATEGY:
- Confirm species precisely (Cattle/Buffalo).
- Identify breed with maximum genomic precision.
- Elaborate on geographical evolution and genetic heritage with deep historical context.
- Provide a comprehensive clinical management protocol that reads like a professional veterinary textbook.

The goal is to produce a detailed multi-page professional PDF report for a high-end research laboratory.

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
