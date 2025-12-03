'use server';

import { generateAiInsights, AiInsightsOutput } from '@/ai/flows/generate-ai-powered-insights';
import type { WarehousePosition } from '@/lib/types';

export async function runAiAnalysis(positions: WarehousePosition[]): Promise<AiInsightsOutput> {
  console.log(`[AI Analysis] Starting analysis with ${positions?.length ?? 0} positions.`);

  if (!positions || positions.length === 0) {
    console.warn("[AI Analysis] No warehouse data available to analyze. Returning default response.");
    return {
      performanceScore: 0,
      aiSuggestions: ["No warehouse data available to analyze."],
    };
  }

  try {
    const insights = await generateAiInsights({ positions });
    console.log("[AI Analysis] Successfully generated insights.");
    return insights;
  } catch (error) {
    console.error("[AI Analysis] Error running AI analysis:", error);
    return {
      performanceScore: 0,
      aiSuggestions: ["An error occurred while generating AI insights. Please check the server logs for details."],
    };
  }
}
