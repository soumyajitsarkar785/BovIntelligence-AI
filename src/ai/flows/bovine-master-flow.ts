
'use server';
/**
 * @fileOverview BovIntelligence AI Master Flow.
 * Implements Elite Senior Livestock Geneticist protocols for precision diagnostics.
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
    cranial: z.string().describe("Analysis of ears, horns, forehead profile."),
    thoracic: z.string().describe("Analysis of hump, dewlap, neck musculature."),
    body: z.string().describe("Analysis of topline, coat, tail, limbs.")
  }),
  visual_evidence_markers: z.array(z.string()).describe("Specific phenotypic markers identified."),
  negative_constraints_check: z.string().describe("Why it does NOT match similar breeds."),
  diagnostic_note: z.string().describe("Expert summary of the analysis."),
  traits: z.object({
    origin: z.string().describe("Extremely detailed history and geographical origin (MUST be 8-10 long sentences)."),
    milkYieldEstimates: z.string().describe("Detailed milk yield estimates, quality, and lactation cycle (MUST be 8-10 long sentences)."),
    environmentalAdaptability: z.string().describe("How the breed handles specific climates, humidity, and terrain (MUST be 8-10 long sentences)."),
    temperament: z.string().describe("Detailed behavioral characteristics and social dynamics (MUST be 8-10 long sentences)."),
    physicalCharacteristics: z.string().describe("Detailed conformation, size, weight, and coat traits (MUST be 8-10 long sentences)."),
    commonUses: z.string().describe("Primary and secondary uses, including draft and dairy (MUST be 8-10 long sentences)."),
  }),
  careGuide: z.object({
    nutritionTips: z.string().describe("Specific feeding protocol, supplements, and forage for this breed (MUST be 10-12 detailed sentences)."),
    healthTips: z.string().describe("Specific disease prevention, vaccinations, and daily care (MUST be 10-12 detailed sentences)."),
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
  prompt: `ROLE: You are an elite Senior Livestock Geneticist and Veterinary Vision Analyst specializing in global cattle and buffalo breed diagnostics.

STRICT PROTOCOL: PROVIDE EXTREMELY DETAILED AND VERBOSE ANALYSIS. 
The user needs highly descriptive and scientific paragraphs. 

MANDATORY RULES:
1. For every field in 'traits', write at least 8 to 10 full, descriptive sentences. No bullet points.
2. For every field in 'careGuide', write at least 10 to 12 full, expert-level sentences.
3. Use professional terminology (e.g., phenotype, genotype, ethology, morphology).
4. Do not summarize. Be as verbose as possible to create a long, professional report.

IMAGE VALIDATION:
* Confirm species (Cattle/Buffalo).
* If invalid (e.g., a dog, human, or car), set status to ERROR.

DIAGNOSTIC REASONING:
1. Cranial: Detailed ear/horn/forehead analysis.
2. Thoracic: Hump/dewlap/neck musculature details.
3. Body: Topline/coat/tail/limb structure details.

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
