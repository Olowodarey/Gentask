import { PullRequest, GateResult } from "@/lib/types";
import { MOCK_PULL_REQUESTS } from "@/lib/mock/pull-requests";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const prService = {
  async listProjectPRs(projectId: string, filters?: {
    ciStatus?: string;
    search?: string;
  }): Promise<PullRequest[]> {
    await delay(300);
    
    let prs = MOCK_PULL_REQUESTS.filter((pr) => pr.projectId === projectId);
    
    if (filters?.ciStatus && filters.ciStatus !== "all") {
      prs = prs.filter((pr) => pr.ciStatus === filters.ciStatus);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      prs = prs.filter(
        (pr) =>
          pr.title.toLowerCase().includes(search) ||
          pr.author.toLowerCase().includes(search) ||
          pr.number.toString().includes(search)
      );
    }
    
    return prs;
  },

  async getPR(id: string): Promise<PullRequest | null> {
    await delay(200);
    return MOCK_PULL_REQUESTS.find((pr) => pr.id === id) || null;
  },

  async runGates(prIds: string[]): Promise<Map<string, GateResult[]>> {
    await delay(1000);
    
    const results = new Map<string, GateResult[]>();
    
    for (const prId of prIds) {
      const pr = MOCK_PULL_REQUESTS.find((p) => p.id === prId);
      if (pr?.gateResults) {
        results.set(prId, pr.gateResults);
      }
    }
    
    return results;
  },

  async getPRsByIds(ids: string[]): Promise<PullRequest[]> {
    await delay(200);
    return MOCK_PULL_REQUESTS.filter((pr) => ids.includes(pr.id));
  },

  async getContributorPRs(contributorUsername: string): Promise<{
    pr: PullRequest;
    batchId: string;
    rank?: number;
    reason?: string;
  }[]> {
    await delay(300);
    
    // Mock contributor PRs with batch association
    const contributorPRs = MOCK_PULL_REQUESTS.filter(
      (pr) => pr.author === contributorUsername
    );
    
    return contributorPRs.slice(0, 5).map((pr, idx) => ({
      pr,
      batchId: `batch${idx + 1}`,
      rank: idx < 3 ? idx + 1 : undefined,
      reason: idx < 3 ? "Excellent implementation with clear documentation" : undefined,
    }));
  },
};
