import { Appeal } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appealService = {
  async fileAppeal(
    batchId: string,
    prId: string,
    contributorId: string,
    reason: string
  ): Promise<Appeal> {
    await delay(800);
    
    const appeal: Appeal = {
      id: `appeal${Date.now()}`,
      batchId,
      prId,
      contributorId,
      reason,
      status: "filed",
      filedAt: new Date().toISOString(),
    };
    
    return appeal;
  },

  async getAppealsForContributor(contributorId: string): Promise<Appeal[]> {
    await delay(300);
    
    // Mock appeals
    return [];
  },

  async getAppealStatus(appealId: string): Promise<Appeal> {
    await delay(200);
    
    return {
      id: appealId,
      batchId: "batch1",
      prId: "pr1",
      contributorId: "c1",
      reason: "Sample appeal",
      status: "under-review",
      filedAt: new Date().toISOString(),
    };
  },
};
