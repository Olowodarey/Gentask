import { Grant } from "@/lib/types";
import { MOCK_GRANTS } from "@/lib/mock/grants";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface GrantApplicationParams {
  projectId: string;
  projectName: string;
  goal: string;
  description: string;
  totalBudget: number;
  chainId: string;
  milestones: {
    title: string;
    description: string;
    amount: number;
    dueDate: string;
  }[];
}

export const grantService = {
  async listGrants(filters?: {
    status?: string;
    projectId?: string;
  }): Promise<Grant[]> {
    await delay(300);
    
    let grants = [...MOCK_GRANTS];
    
    if (filters?.status && filters.status !== "all") {
      grants = grants.filter((g) => g.status === filters.status);
    }
    
    if (filters?.projectId) {
      grants = grants.filter((g) => g.projectId === filters.projectId);
    }
    
    return grants;
  },

  async getGrant(id: string): Promise<Grant | null> {
    await delay(200);
    return MOCK_GRANTS.find((g) => g.id === id) || null;
  },

  async applyForGrant(params: GrantApplicationParams): Promise<Grant> {
    await delay(800);
    
    // Mock grant application
    const newGrant: Grant = {
      id: `grant${Date.now()}`,
      projectId: params.projectId,
      projectName: params.projectName,
      projectLogo: "📦",
      maintainer: "current_user",
      goal: params.goal,
      description: params.description,
      totalBudget: params.totalBudget,
      chain: { id: params.chainId, name: params.chainId, symbol: "ETH", logo: "⟠" },
      milestones: params.milestones.map((m, idx) => ({
        id: `m${idx + 1}`,
        ...m,
        status: "pending" as const,
      })),
      status: "pending",
      appliedAt: new Date().toISOString(),
    };
    
    return newGrant;
  },
};
