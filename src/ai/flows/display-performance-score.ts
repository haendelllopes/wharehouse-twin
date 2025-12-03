'use server';

/**
 * @fileOverview A flow to display a performance score based on AI analysis of warehouse data.
 *
 * - displayPerformanceScore - A function that returns the performance score and AI suggestions.
 * - PerformanceScoreOutput - The return type for the displayPerformanceScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceScoreOutputSchema = z.object({
  performanceScore: z.number().describe('Overall warehouse performance score between 0 and 100.'),
  aiSuggestions: z.array(z.string()).describe('AI-generated suggestions for warehouse improvement.'),
});
export type PerformanceScoreOutput = z.infer<typeof PerformanceScoreOutputSchema>;

export async function displayPerformanceScore(): Promise<PerformanceScoreOutput> {
  return displayPerformanceScoreFlow();
}

const performanceScorePrompt = ai.definePrompt({
  name: 'performanceScorePrompt',
  output: {schema: PerformanceScoreOutputSchema},
  prompt: `You are an AI assistant that analyzes warehouse data and provides a performance score and suggestions for improvement.

Analyze the following warehouse data (currently unavailable) and provide a performance score between 0 and 100, and a list of AI-generated suggestions for warehouse improvement. Consider factors such as occupancy rates, potential safety hazards, and layout inefficiencies.

Return the output as a JSON object:
{{output}}`,
});

const displayPerformanceScoreFlow = ai.defineFlow(
  {
    name: 'displayPerformanceScoreFlow',
    outputSchema: PerformanceScoreOutputSchema,
  },
  async () => {
    const {output} = await performanceScorePrompt({});
    return output!;
  }
);
