import { create } from "zustand";
import { WalletState } from "@/lib/types";
import { walletService } from "@/lib/services/wallet-service";
import { NETWORK, type WalletMode } from "@/lib/genlayer/client";
import type { EIP1193Provider } from "@/lib/genlayer/wallets";

interface WalletStore extends WalletState {
  mode: WalletMode | null;
  walletName: string | null;
  isConnecting: boolean;
  connectWallet: (provider: EIP1193Provider, name: string) => Promise<void>;
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
  walletName: null as string | null,
};

async function run(
  set: (partial: Partial<WalletStore>) => void,
  fn: () => Promise<Awaited<ReturnType<typeof walletService.connectBurner>>>
) {
  set({ isConnecting: true });
  try {
    const { mode, walletName, ...state } = await fn();
    set({ ...state, mode, walletName, isConnecting: false });
  } catch (error) {
    set({ isConnecting: false });
    throw error;
  }
}

export const useWalletStore = create<WalletStore>((set) => ({
  ...disconnected,
  isConnecting: false,

  connectWallet: (provider, name) => run(set, () => walletService.connectWallet(provider, name)),
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
