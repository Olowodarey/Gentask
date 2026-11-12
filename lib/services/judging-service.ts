import { JudgingResult } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const judgingService = {
  async startJudging(batchId: string): Promise<void> {
    await delay(500);
    // Mock starting judging process
  },

  async getResult(batchId: string): Promise<JudgingResult | null> {
    await delay(300);
    
    // Mock judging results
    return {
      batchId,
      winnerId: "pr1",
      ranking: [
        {
          prId: "pr1",
          rank: 1,
          reason: "Excellent bug fix with comprehensive tests and clear documentation",
          score: 95,
        },
        {
          prId: "pr2",
          rank: 2,
          reason: "Good implementation but missing some edge case handling",
          score: 87,
        },
        {
          prId: "pr3",
          rank: 3,
          reason: "Solid work, minor documentation improvements needed",
          score: 82,
        },
      ],
      consensusReached: true,
      validatorCount: 5,
      completedAt: new Date().toISOString(),
    };
  },

  async appeal(batchId: string, prId: string, reason: string): Promise<void> {
    await delay(600);
    // Mock appeal submission
    console.log(`Appeal submitted for PR ${prId} in batch ${batchId}: ${reason}`);
  },
};
