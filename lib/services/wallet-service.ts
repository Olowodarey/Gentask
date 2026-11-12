import { WalletState } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const walletService = {
  async connect(): Promise<WalletState> {
    await delay(500);
    
    // Mock wallet connection
    return {
      connected: true,
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
      balance: 1250.50,
      chainId: "base",
    };
  },

  async disconnect(): Promise<void> {
    await delay(200);
    // Mock wallet disconnection
  },

  async getBalance(address: string): Promise<number> {
    await delay(300);
    return 1250.50;
  },

  async switchChain(chainId: string): Promise<void> {
    await delay(400);
    // Mock chain switching
  },

  async linkWallet(contributorId: string, address: string): Promise<void> {
    await delay(500);
    // Mock wallet linking for contributor
  },
};
