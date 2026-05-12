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
    origin: z.string(),
    milkYieldEstimates: z.string(),
    environmentalAdaptability: z.string(),
    temperament: z.string(),
    physicalCharacteristics: z.string(),
    commonUses: z.string(),
  }),
  careGuide: z.object({
    nutritionTips: z.string(),
    healthTips: z.string(),
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
  prompt: `ROLE: You are an elite Senior Livestock Geneticist and Veterinary Vision Analyst specializing in cattle and buffalo breed diagnostics using high-resolution morphological and phenotypic analysis.

STRICT PROTOCOL 1: IMAGE VALIDATION
* Confirm whether the target is cattle (bovine) or buffalo (bubaline).
* If not livestock, set detected_status to "ERROR" and primary_breed to "Non-livestock".
* Validate visibility of: 1. Head/Ears, 2. Horns/Hump, 3. Dewlap/Neck, 4. Torso/Topline, 5. Tail/Coat Pattern.
* If two or more critical markers are missing or obstructed, set detected_status to "ERROR" with "Insufficient visual data".

STRICT PROTOCOL 2: STRUCTURED VETERINARY REASONING
Analyze phenotypic markers:
1. Cranial Morphology: Ear curvature, horn orientation, forehead profile.
2. Thoracic Morphology: Hump prominence, dewlap fold density, neck musculature.
3. Body Morphology: Topline shape, coat pigmentation, tail switch, limb structure.

STRICT PROTOCOL 3: GEOGRAPHIC FILTERING
Description/Context: {{{description}}}
* Prioritize indigenous regional breeds if context is provided. Evaluate for crossbreed lineage (Bos indicus × Bos taurus).

STRICT PROTOCOL 4: NEGATIVE CONSTRAINTS
* Explain why the animal does NOT match the closest similar breed. Never guess missing traits.

STRICT PROTOCOL 5: CONFIDENCE CALIBRATION
* 90–100%: Strong alignment.
* 70–89%: Probable match.
* 40–69%: Mixed/Partial.
* Below 40%: Unidentified.

STRICT PROTOCOL 6: CROSSBREED DETECTION
* Prioritize "Crossbreed" classification if both indicus and taurine traits are visible.

STRICT PROTOCOL 7: IMAGE CONTEXT FILTERING
* Focus only on the animal body. Ignore humans, ropes, or clutter.

MANDATORY DATA: Also provide standard 'traits' and 'careGuide' fields as per schema.

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
