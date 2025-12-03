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
  performanceScore: z.number().describe('Pontuação geral de desempenho do armazém (0-100)'),
  aiSuggestions: z.array(z.string()).describe('Lista de sugestões geradas por IA para melhoria'),
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
  prompt: `Você é um assistente de IA que analisa dados de armazém e fornece insights para otimização em Português do Brasil.

  Analise os seguintes dados do armazém e forneça:
  1. Uma pontuação geral de desempenho do armazém (0-100), considerando fatores como ocupação, utilização e possíveis gargalos.
  2. Uma lista de sugestões geradas por IA para melhorar a eficiência do armazém.

  Dados do Armazém:
  {{#each positions}}
  - Posição ID: {{id}}, Código: {{code}}, Tipo: {{type}}, Ocupação: {{occupancyPercentage}}%, Status: {{status}}
  {{/each}}

  IMPORTANTE: Se uma posição tiver status 'ALERT' ou 'BLOCKED', crie uma sugestão específica para ela e **inclua o código da posição na sugestão** (ex: "Verificar item danificado na posição R01-C01-L5.").
  Garanta que todas as sugestões sejam específicas e acionáveis.
  Forneça a saída em formato JSON.
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
