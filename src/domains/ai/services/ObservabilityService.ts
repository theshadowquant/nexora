import { prisma } from "@/lib/prisma";

export interface CostRates {
  inputRate: number; // USD per token
  outputRate: number; // USD per token
}

// Pricing metrics: USD per single token
const PRICING_MAP: Record<string, CostRates> = {
  "gpt-4o-mini": {
    inputRate: 0.15 / 1_000_000,
    outputRate: 0.60 / 1_000_000,
  },
  "text-embedding-3-small": {
    inputRate: 0.02 / 1_000_000,
    outputRate: 0.0,
  },
  "claude-3-5-sonnet": {
    inputRate: 3.00 / 1_000_000,
    outputRate: 15.00 / 1_000_000,
  },
  default: {
    inputRate: 0.15 / 1_000_000,
    outputRate: 0.60 / 1_000_000,
  },
};

export const ObservabilityService = {
  /**
   * Logs an AI completion/embedding invocation, calculates cost, and updates the database.
   */
  async logCall(
    userId: string | null,
    model: string,
    promptTokens: number,
    completionTokens: number,
    latencyMs: number
  ) {
    const pricing = PRICING_MAP[model] || PRICING_MAP.default;
    const cost = promptTokens * pricing.inputRate + completionTokens * pricing.outputRate;

    // Use floating precision for database log
    const finalCost = parseFloat(cost.toFixed(8));

    return prisma.aiLog.create({
      data: {
        userId,
        model,
        promptTokens,
        completionTokens,
        cost: finalCost,
        latencyMs,
      },
    });
  },

  /**
   * Fetches overall token logs, latency averages, and cost data.
   */
  async getCostSummary() {
    const logs = await prisma.aiLog.findMany({
      orderBy: { createdAt: "desc" },
    });

    const modelSummaries: Record<
      string,
      { calls: number; cost: number; tokens: number; avgLatency: number }
    > = {};

    let totalCost = 0;
    let totalCalls = 0;
    let totalTokens = 0;

    for (const log of logs) {
      totalCost += log.cost;
      totalCalls += 1;
      const tokens = log.promptTokens + log.completionTokens;
      totalTokens += tokens;

      if (!modelSummaries[log.model]) {
        modelSummaries[log.model] = { calls: 0, cost: 0, tokens: 0, avgLatency: 0 };
      }

      const m = modelSummaries[log.model];
      m.calls += 1;
      m.cost += log.cost;
      m.tokens += tokens;
      m.avgLatency += log.latencyMs;
    }

    // Average latency calculations
    for (const mKey of Object.keys(modelSummaries)) {
      const summary = modelSummaries[mKey];
      summary.avgLatency = Math.round(summary.avgLatency / summary.calls);
      summary.cost = parseFloat(summary.cost.toFixed(6));
    }

    return {
      totalCost: parseFloat(totalCost.toFixed(6)),
      totalCalls,
      totalTokens,
      modelSummaries,
    };
  },

  /**
   * Records user-driven helpfulness and correction audits.
   */
  async submitFeedback(
    userId: string,
    targetType: string,
    targetId: string,
    rating: "HELPFUL" | "WRONG" | "CONFUSING" | "TOO_EASY" | "TOO_HARD",
    comment?: string
  ) {
    return prisma.aiFeedback.create({
      data: {
        userId,
        targetType,
        targetId,
        rating,
        comment,
      },
    });
  },
};
