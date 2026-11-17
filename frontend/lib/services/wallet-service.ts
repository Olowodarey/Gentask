import { WalletState } from "@/lib/types";
import {
  NETWORK,
  type WalletMode,
  getBurnerAddress,
  getGenBalance,
  connectInjected,
  useBurnerWallet,
} from "@/lib/genlayer/client";
import type { EIP1193Provider } from "@/lib/genlayer/wallets";

export type ConnectResult = WalletState & { mode: WalletMode; walletName: string };

/**
 * Wallet service. Connects any injected EVM wallet (MetaMask, OKX, Rabby,
 * Coinbase, … via EIP-6963), or a persistent in-browser burner account that
 * needs no setup. Either way the result is a real on-chain account that signs.
 */
export const walletService = {
  async connectWallet(provider: EIP1193Provider, name: string): Promise<ConnectResult> {
    const address = await connectInjected(provider);
    const balance = await getGenBalance(address);
    return { connected: true, address, balance, chainId: NETWORK, mode: "injected", walletName: name };
  },

  async connectBurner(): Promise<ConnectResult> {
    useBurnerWallet();
    const address = getBurnerAddress();
    const balance = await getGenBalance(address);
    return {
      connected: true,
      address,
      balance,
      chainId: NETWORK,
      mode: "burner",
      walletName: "Burner wallet",
    };
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
