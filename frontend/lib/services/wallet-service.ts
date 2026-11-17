import { WalletState } from "@/lib/types";
import {
  NETWORK,
  getBurnerAddress,
  getGenBalance,
} from "@/lib/genlayer/client";

/**
 * Wallet service backed by the GenLayer burner account.
 *
 * The burner key persists in localStorage (see lib/genlayer/client.ts), so the
 * same address is returned across reloads. This is a real on-chain account that
 * signs real transactions; replace with MetaMask via `client.connect()` later.
 */
export const walletService = {
  async connect(): Promise<WalletState> {
    const address = getBurnerAddress();
    const balance = await getGenBalance(address);
    return { connected: true, address, balance, chainId: NETWORK };
  },

  async disconnect(): Promise<void> {
    // Burner stays in localStorage; disconnect only clears the UI session.
  },

  async getBalance(address: string): Promise<number> {
    return getGenBalance(address);
  },

  async switchChain(_chainId: string): Promise<void> {
    // Network is fixed by NEXT_PUBLIC_GENLAYER_NETWORK until MetaMask lands.
  },

  async linkWallet(_contributorId: string, _address: string): Promise<void> {
    // No-op until the contributor wallet registry exists on-chain.
  },
};
