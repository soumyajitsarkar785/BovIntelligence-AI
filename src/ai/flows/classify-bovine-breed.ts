'use server';
/**
 * @fileOverview A Genkit flow for classifying bovine breeds from an image and optional description.
 *
 * - classifyBovineBreed - A function that handles the bovine breed classification process.
 * - ClassifyBovineBreedInput - The input type for the classifyBovineBreed function.
 * - ClassifyBovineBreedOutput - The return type for the classifyBovineBreed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyBovineBreedInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a bovine animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .optional()
    .describe(
      'An optional text description of the animal in the photo, providing additional context.'
    ),
});
export type ClassifyBovineBreedInput = z.infer<
  typeof ClassifyBovineBreedInputSchema
>;

const ClassifyBovineBreedOutputSchema = z.object({
  isBovine: z
    .boolean()
    .describe('Whether the identified animal in the image is a bovine (cattle or buffalo).'),
  breedName: z
    .string()
    .describe('The identified breed name of the bovine, or "N/A" if not a bovine.'),
  confidence: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The confidence level of the breed identification.'),
});
export type ClassifyBovineBreedOutput = z.infer<
  typeof ClassifyBovineBreedOutputSchema
>;

export async function classifyBovineBreed(
  input: ClassifyBovineBreedInput
): Promise<ClassifyBovineBreedOutput> {
  return classifyBovineBreedFlow(input);
}

const classifyBovineBreedPrompt = ai.definePrompt({
  name: 'classifyBovineBreedPrompt',
  input: {schema: ClassifyBovineBreedInputSchema},
  output: {schema: ClassifyBovineBreedOutputSchema},
  prompt: `You are an expert in identifying cattle and buffalo breeds from images and descriptions.

Analyze the provided image and description to identify the specific breed of the bovine animal. If the animal is clearly not a bovine, set isBovine to false and breedName to "N/A". Otherwise, identify the breed name and provide a confidence level for your identification.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const classifyBovineBreedFlow = ai.defineFlow(
  {
    name: 'classifyBovineBreedFlow',
    inputSchema: ClassifyBovineBreedInputSchema,
    outputSchema: ClassifyBovineBreedOutputSchema,
  },
  async input => {
    const {output} = await classifyBovineBreedPrompt(input, {model: 'googleai/gemini-2.5-flash'});
    return output!;
  }
);
