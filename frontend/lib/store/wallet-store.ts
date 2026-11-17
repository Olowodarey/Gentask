import { create } from "zustand";
import { WalletState } from "@/lib/types";
import { walletService } from "@/lib/services/wallet-service";
import { NETWORK, type WalletMode } from "@/lib/genlayer/client";

interface WalletStore extends WalletState {
  mode: WalletMode | null;
  isConnecting: boolean;
  hasMetaMask: boolean;
  connect: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  connectBurner: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
}

const disconnected = {
  connected: false,
  address: null,
  balance: 0,
  chainId: NETWORK,
  mode: null as WalletMode | null,
};

async function run(
  set: (partial: Partial<WalletStore>) => void,
  fn: () => Promise<Awaited<ReturnType<typeof walletService.connect>>>
) {
  set({ isConnecting: true });
  try {
    const { mode, ...state } = await fn();
    set({ ...state, mode, isConnecting: false });
  } catch (error) {
    set({ isConnecting: false });
    throw error;
  }
}

export const useWalletStore = create<WalletStore>((set) => ({
  ...disconnected,
  isConnecting: false,
  hasMetaMask: walletService.hasMetaMask(),

  connect: () => run(set, () => walletService.connect()),
  connectMetaMask: () => run(set, () => walletService.connectMetaMask()),
  connectBurner: () => run(set, () => walletService.connectBurner()),

  disconnect: async () => {
    await walletService.disconnect();
    set({ ...disconnected });
  },

  switchChain: async (chainId: string) => {
    await walletService.switchChain(chainId);
    set({ chainId });
  },
}));
