import { Campaign } from "@/lib/types";
import { MOCK_CAMPAIGNS } from "@/lib/mock/campaigns";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const campaignService = {
  async listCampaigns(filters?: {
    status?: string;
    chain?: string;
  }): Promise<Campaign[]> {
    await delay(300);
    
    let campaigns = [...MOCK_CAMPAIGNS];
    
    if (filters?.status && filters.status !== "all") {
      campaigns = campaigns.filter((c) => c.status === filters.status);
    }
    
    if (filters?.chain && filters.chain !== "all") {
      campaigns = campaigns.filter((c) => c.chain.id === filters.chain);
    }
    
    return campaigns;
  },

  async getCampaign(id: string): Promise<Campaign | null> {
    await delay(200);
    return MOCK_CAMPAIGNS.find((c) => c.id === id) || null;
  },

  async joinCampaign(campaignId: string, projectId: string): Promise<void> {
    await delay(500);
    // Mock joining campaign
  },
};
