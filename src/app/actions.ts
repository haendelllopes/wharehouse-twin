'use server';

import { generateAiInsights, AiInsightsOutput } from '@/ai/flows/generate-ai-powered-insights';
import type { WarehousePosition } from '@/lib/types';

export async function runAiAnalysis(positions: WarehousePosition[]): Promise<AiInsightsOutput> {
  console.log(`[AI Analysis] Starting analysis with ${positions?.length ?? 0} total positions.`);

  if (!positions || positions.length === 0) {
    console.warn("[AI Analysis] No warehouse data available to analyze. Returning default response.");
    return {
      performanceScore: 0,
      aiSuggestions: ["Não há dados de armazém para analisar."],
    };
  }

  // Prioritize sending problematic positions to AI to avoid timeouts with large datasets
  const problematicPositions = positions.filter(p => p.status === 'ALERT' || p.status === 'BLOCKED');

  let analysisInput = positions;
  
  if (problematicPositions.length > 0) {
    console.log(`[AI Analysis] Found ${problematicPositions.length} problematic positions. Analyzing them.`);
    analysisInput = problematicPositions;
  } else {
    // If there are no immediate problems, we can return a positive base analysis without calling the AI
    // This saves resources and prevents timeouts on large but healthy warehouses.
    console.log("[AI Analysis] No problematic positions found. Returning default positive response.");
    return {
        performanceScore: 95,
        aiSuggestions: ["Nenhum problema crítico detectado. O layout parece eficiente para as operações atuais."],
    };
  }

  try {
    const insights = await generateAiInsights({ positions: analysisInput });
    console.log("[AI Analysis] Successfully generated insights.");
    return insights;
  } catch (error) {
    console.error("[AI Analysis] Error running AI analysis:", error);
    // Return a structured error response to the client
    return {
      performanceScore: 0,
      aiSuggestions: ["Ocorreu um erro ao gerar os insights da IA. Verifique os logs do servidor para mais detalhes."],
    };
  }
}
