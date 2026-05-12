'use server';
/**
 * @fileOverview A Genkit flow for retrieving detailed information about a specific bovine breed.
 *
 * - profileBovineTraits - A function that handles the retrieval of breed traits.
 * - ProfileBovineTraitsInput - The input type for the profileBovineTraits function.
 * - ProfileBovineTraitsOutput - The return type for the profileBovineTraits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileBovineTraitsInputSchema = z.object({
  breedName: z.string().describe('The name of the bovine breed.'),
});
export type ProfileBovineTraitsInput = z.infer<typeof ProfileBovineTraitsInputSchema>;

const ProfileBovineTraitsOutputSchema = z.object({
  origin: z.string().describe('The geographical origin and history of the breed.'),
  milkYieldEstimates: z
    .string()
    .describe('Estimated milk yield (e.g., liters/day, kg/lactation) and milk quality characteristics.'),
  environmentalAdaptability: z
    .string()
    .describe('How well the breed adapts to different climates, temperatures, and terrains.'),
  temperament: z.string().describe('General temperament and behavior characteristics of the breed.'),
  physicalCharacteristics: z
    .string()
    .describe('Key physical traits like size, coat color, horn shape, and body conformation.'),
  commonUses: z.string().describe('Primary uses of the breed (e.g., dairy, beef, draft).'),
  specialNotes: z.string().optional().describe('Any other notable or unique facts about the breed.'),
});
export type ProfileBovineTraitsOutput = z.infer<typeof ProfileBovineTraitsOutputSchema>;

export async function profileBovineTraits(input: ProfileBovineTraitsInput): Promise<ProfileBovineTraitsOutput> {
  return profileBovineTraitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileBovineTraitsPrompt',
  input: {schema: ProfileBovineTraitsInputSchema},
  output: {schema: ProfileBovineTraitsOutputSchema},
  prompt: `You are an expert in bovine breeds. Provide detailed information about the {{{breedName}}} breed.
Include its origin, typical milk yield estimates, environmental adaptability, temperament, physical characteristics, and common uses.
If there are any special or unique notes, include those as well. Format the output according to the provided JSON schema.`,
});

const profileBovineTraitsFlow = ai.defineFlow(
  {
    name: 'profileBovineTraitsFlow',
    inputSchema: ProfileBovineTraitsInputSchema,
    outputSchema: ProfileBovineTraitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
