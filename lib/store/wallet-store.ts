import { create } from "zustand";
import { WalletState } from "@/lib/types";
import { walletService } from "@/lib/services/wallet-service";

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  isConnecting: boolean;
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: null,
  balance: 0,
  chainId: "base",
  isConnecting: false,

  connect: async () => {
    set({ isConnecting: true });
    try {
      const walletState = await walletService.connect();
      set({ ...walletState, isConnecting: false });
    } catch (error) {
      set({ isConnecting: false });
      throw error;
    }
  },

  disconnect: async () => {
    await walletService.disconnect();
    set({
      connected: false,
      address: null,
      balance: 0,
      chainId: "base",
    });
  },

  switchChain: async (chainId: string) => {
    await walletService.switchChain(chainId);
    set({ chainId });
  },
}));
