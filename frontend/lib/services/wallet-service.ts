import { WalletState } from "@/lib/types";
import {
  NETWORK,
  type WalletMode,
  getBurnerAddress,
  getGenBalance,
  connectMetaMask,
  useBurnerWallet,
  hasMetaMask,
} from "@/lib/genlayer/client";

export type ConnectResult = WalletState & { mode: WalletMode };

/**
 * Wallet service. Prefers MetaMask (via the GenLayer Snap); falls back to a
 * persistent in-browser burner account when MetaMask is unavailable or declined.
 * Either way the result is a real on-chain account that signs transactions.
 */
export const walletService = {
  hasMetaMask,

  async connectBurner(): Promise<ConnectResult> {
    useBurnerWallet();
    const address = getBurnerAddress();
    const balance = await getGenBalance(address);
    return { connected: true, address, balance, chainId: NETWORK, mode: "burner" };
  },

  async connectMetaMask(): Promise<ConnectResult> {
    const address = await connectMetaMask();
    const balance = await getGenBalance(address);
    return { connected: true, address, balance, chainId: NETWORK, mode: "metamask" };
  },

  /** Try MetaMask first, fall back to the burner account on any failure. */
  async connect(): Promise<ConnectResult> {
    if (hasMetaMask()) {
      try {
        return await this.connectMetaMask();
      } catch {
        // user rejected or snap unavailable — fall through to burner
      }
    }
    return this.connectBurner();
  },

  async disconnect(): Promise<void> {
    useBurnerWallet();
  },

  async getBalance(address: string): Promise<number> {
    return getGenBalance(address);
  },

  async switchChain(_chainId: string): Promise<void> {
    // Network is fixed by NEXT_PUBLIC_GENLAYER_NETWORK.
  },

  async linkWallet(_contributorId: string, _address: string): Promise<void> {
    // No-op until the contributor wallet registry exists on-chain.
  },
};
