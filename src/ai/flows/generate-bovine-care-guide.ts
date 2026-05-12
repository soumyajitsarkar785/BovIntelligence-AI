'use server';
/**
 * @fileOverview A Genkit flow for generating breed-specific nutrition and health management tips for bovines.
 *
 * - generateBovineCareGuide - A function that handles the generation of care guides.
 * - GenerateBovineCareGuideInput - The input type for the generateBovineCareGuide function.
 * - GenerateBovineCareGuideOutput - The return type for the generateBovineCareGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBovineCareGuideInputSchema = z.object({
  breedName: z.string().describe('The identified breed of the bovine.'),
  lifeStage: z
    .string()
    .describe("The life stage of the bovine (e.g., 'calf', 'adult', 'lactating')."),
});
export type GenerateBovineCareGuideInput = z.infer<
  typeof GenerateBovineCareGuideInputSchema
>;

const GenerateBovineCareGuideOutputSchema = z.object({
  nutritionTips: z
    .string()
    .describe('Detailed nutrition management tips for the specified breed and life stage.'),
  healthTips: z
    .string()
    .describe('Detailed health management tips for the specified breed and life stage.'),
});
export type GenerateBovineCareGuideOutput = z.infer<
  typeof GenerateBovineCareGuideOutputSchema
>;

export async function generateBovineCareGuide(
  input: GenerateBovineCareGuideInput
): Promise<GenerateBovineCareGuideOutput> {
  return generateBovineCareGuideFlow(input);
}

const generateBovineCareGuidePrompt = ai.definePrompt({
  name: 'generateBovineCareGuidePrompt',
  input: {schema: GenerateBovineCareGuideInputSchema},
  output: {schema: GenerateBovineCareGuideOutputSchema},
  prompt: `You are an expert veterinarian and animal husbandry specialist.

Generate breed-specific nutrition and health management tips for a bovine given its breed and life stage.

Breed: {{{breedName}}}
Life Stage: {{{lifeStage}}}

Provide comprehensive guidance for both nutrition and health in a structured, easy-to-understand format.

Nutrition Tips:

Health Management Tips:`,
});

const generateBovineCareGuideFlow = ai.defineFlow(
  {
    name: 'generateBovineCareGuideFlow',
    inputSchema: GenerateBovineCareGuideInputSchema,
    outputSchema: GenerateBovineCareGuideOutputSchema,
  },
  async input => {
    const {output} = await generateBovineCareGuidePrompt(input);
    return output!;
  }
);
