'use server';

import { generateAiInsights, AiInsightsOutput } from '@/ai/flows/generate-ai-powered-insights';
import type { WarehousePosition } from '@/lib/types';

export async function runAiAnalysis(positions: WarehousePosition[]): Promise<AiInsightsOutput> {
  if (!positions || positions.length === 0) {
    return {
      performanceScore: 0,
      aiSuggestions: ["No warehouse data available to analyze."],
    };
  }

  try {
    const insights = await generateAiInsights({ positions });
    return insights;
  } catch (error) {
    console.error("Error running AI analysis:", error);
    return {
      performanceScore: 0,
      aiSuggestions: ["An error occurred while generating AI insights. Please check the server logs."],
    };
  }
}
