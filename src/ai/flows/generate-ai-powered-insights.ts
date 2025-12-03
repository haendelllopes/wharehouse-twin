// src/ai/flows/generate-ai-powered-insights.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate AI-powered insights based on warehouse data.
 *
 * The flow takes in warehouse data and outputs a performance score and a list of AI-generated suggestions
 * for optimizing the warehouse layout and improving overall efficiency.
 *
 * @module src/ai/flows/generate-ai-powered-insights
 *
 * @exported
 * - `generateAiInsights`: The main function to trigger the AI insights generation flow.
 * - `AiInsightsInput`: The input type for the generateAiInsights function.
 * - `AiInsightsOutput`: The output type for the generateAiInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the AI insights flow
const AiInsightsInputSchema = z.object({
  positions: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      type: z.enum(['RACK', 'FLOOR_BLOCK']),
      position: z.tuple([z.number(), z.number(), z.number()]),
      rotation: z.tuple([z.number(), z.number(), z.number()]),
      dimensions: z.tuple([z.number(), z.number(), z.number()]),
      occupancyPercentage: z.number(),
      status: z.enum(['NORMAL', 'ALERT', 'EMPTY', 'BLOCKED']),
      items: z.array(
        z.object({
          sku: z.string(),
          description: z.string(),
          quantity: z.number(),
          lpn: z.string().optional(),
        })
      ),
      lastUpdated: z.string(),
    })
  ).describe('Array of warehouse positions with their details'),
});
export type AiInsightsInput = z.infer<typeof AiInsightsInputSchema>;

// Define the output schema for the AI insights flow
const AiInsightsOutputSchema = z.object({
  performanceScore: z.number().describe('Overall warehouse performance score (0-100)'),
  aiSuggestions: z.array(z.string()).describe('List of AI-generated suggestions for improvement'),
});
export type AiInsightsOutput = z.infer<typeof AiInsightsOutputSchema>;

// Define the AI insights generation flow
const aiInsightsFlow = ai.defineFlow(
  {
    name: 'aiInsightsFlow',
    inputSchema: AiInsightsInputSchema,
    outputSchema: AiInsightsOutputSchema,
  },
  async input => {
    const {output} = await aiInsightsPrompt(input);
    return output!;
  }
);

// Define the prompt for generating AI insights
const aiInsightsPrompt = ai.definePrompt({
  name: 'aiInsightsPrompt',
  input: {schema: AiInsightsInputSchema},
  output: {schema: AiInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes warehouse data and provides insights for optimization.

  Analyze the following warehouse data and provide:
  1. An overall warehouse performance score (0-100), considering factors like occupancy, utilization, and potential bottlenecks.
  2. A list of AI-generated suggestions for improving warehouse efficiency, such as identifying underutilized areas or potential bottlenecks.

  Warehouse Data:
  {{#each positions}}
  - Position ID: {{id}}, Code: {{code}}, Type: {{type}}, Occupancy: {{occupancyPercentage}}%, Status: {{status}}
  {{/each}}

  Ensure the suggestions are specific and actionable.
  Please provide the output in JSON format.
`,
});

/**
 * Generates AI-powered insights for warehouse optimization.
 *
 * @param input - The input data containing warehouse positions and their details.
 * @returns A promise that resolves to an object containing the performance score and AI suggestions.
 */
export async function generateAiInsights(input: AiInsightsInput): Promise<AiInsightsOutput> {
  return aiInsightsFlow(input);
}
