import { Payout } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const payoutService = {
  async getPayoutsForContributor(contributorId: string): Promise<Payout[]> {
    await delay(300);
    
    // Mock payouts
    return [
      {
        id: "payout1",
        batchId: "batch10",
        prId: "pr10",
        contributorId,
        amount: 5000,
        stablecoin: "USDC",
        chain: { id: "base", name: "Base", symbol: "ETH", logo: "🔵" },
        status: "claimable",
        walletLinked: true,
      },
    ];
  },

  async linkWallet(contributorId: string, walletAddress: string): Promise<void> {
    await delay(600);
    // Mock wallet linking
  },

  async claimPayout(payoutId: string): Promise<{ txHash: string }> {
    await delay(1200);
    
    return {
      txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    };
  },

  async getPayoutStatus(payoutId: string): Promise<Payout["status"]> {
    await delay(200);
    return "claimable";
  },
};
