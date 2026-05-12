'use server';
/**
 * @fileOverview A consolidated Master Genkit flow for complete bovine analysis.
 * Reduces multiple API calls into one to prevent quota exhaustion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BovineMasterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe("A photo of a bovine animal as a data URI."),
  description: z.string().optional().describe('Optional user context.'),
});

const BovineMasterOutputSchema = z.object({
  isBovine: z.boolean().describe('Is it a cow/buffalo?'),
  breedName: z.string().describe('Identified breed.'),
  confidence: z.enum(['High', 'Medium', 'Low']),
  traits: z.object({
    origin: z.string(),
    milkYieldEstimates: z.string(),
    environmentalAdaptability: z.string(),
    temperament: z.string(),
    physicalCharacteristics: z.string(),
    commonUses: z.string(),
    specialNotes: z.string().optional(),
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
  prompt: `You are an elite bovine genomic specialist and veterinarian.
Analyze the provided image and description to identify the breed and provide a complete profile.

If the animal is NOT a bovine, set isBovine to false and provide placeholder data.

Otherwise:
1. Identify the breed.
2. Provide origins, milk yield (if applicable), adaptability, and temperament.
3. Provide nutrition and health management protocols for this specific breed.

Description: {{{description}}}
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
