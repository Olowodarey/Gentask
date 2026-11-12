import { ReviewBatch, PayoutMode, Rubric } from "@/lib/types";
import { MOCK_BATCHES } from "@/lib/mock/batches";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CreateBatchParams {
  projectId: string;
  selectedPRs: string[];
  rubric: Rubric;
  rewardPool: number;
  stablecoin: string;
  chainId: string;
  deadline: string;
  payoutMode: PayoutMode;
}

export const batchService = {
  async listBatches(filters?: {
    status?: string;
    chain?: string;
    minReward?: number;
    maxReward?: number;
    workType?: string;
    language?: string;
    search?: string;
  }): Promise<ReviewBatch[]> {
    await delay(300);

    let batches = [...MOCK_BATCHES];

    if (filters?.status && filters.status !== "all") {
      batches = batches.filter((b) => b.status === filters.status);
    }

    if (filters?.chain && filters.chain !== "all") {
      batches = batches.filter((b) => b.chain.id === filters.chain);
    }

    if (filters?.minReward !== undefined && filters.minReward !== null) {
      batches = batches.filter((b) => b.rewardPool >= filters.minReward!);
    }

    if (filters?.maxReward !== undefined && filters.maxReward !== null) {
      batches = batches.filter((b) => b.rewardPool <= filters.maxReward!);
    }

    if (filters?.workType && filters.workType !== "all") {
      batches = batches.filter((b) => b.rubric.template === filters.workType);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      batches = batches.filter(
        (b) =>
          b.projectName.toLowerCase().includes(search) ||
          b.maintainer.toLowerCase().includes(search),
      );
    }

    return batches;
  },

  async getBatch(id: string): Promise<ReviewBatch | null> {
    await delay(200);
    return MOCK_BATCHES.find((b) => b.id === id) || null;
  },

  async createBatch(params: CreateBatchParams): Promise<ReviewBatch> {
    await delay(800);

    // Mock batch creation
    const newBatch: ReviewBatch = {
      id: `batch${Date.now()}`,
      projectId: params.projectId,
      projectName: "New Project",
      projectLogo: "📦",
      maintainer: "current_user",
      maintainerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      rubric: params.rubric,
      rubricLocked: true,
      rewardPool: params.rewardPool,
      stablecoin: params.stablecoin,
      chain: {
        id: params.chainId,
        name: params.chainId,
        symbol: "ETH",
        logo: "⟠",
      },
      deadline: params.deadline,
      payoutMode: params.payoutMode,
      status: "open",
      selectedPRs: params.selectedPRs,
      createdAt: new Date().toISOString(),
      escrowTxHash: `0x${Math.random().toString(16).slice(2)}`,
    };

    return newBatch;
  },

  async getUserBatches(maintainer: string): Promise<ReviewBatch[]> {
    await delay(300);
    return MOCK_BATCHES.filter((b) => b.maintainer === maintainer);
  },
};
