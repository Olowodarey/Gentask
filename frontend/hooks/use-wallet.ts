import { useEffect, useState } from "react";
import { useWalletStore } from "@/lib/store/wallet-store";
import { discoverWallets, type DiscoveredWallet } from "@/lib/genlayer/wallets";

export function useWallet() {
  const {
    connected,
    address,
    balance,
    chainId,
    mode,
    walletName,
    connectWallet,
    connectBurner,
    disconnect,
    switchChain,
    isConnecting,
  } = useWalletStore();

  return {
    connected,
    address,
    balance,
    chainId,
    mode,
    walletName,
    connectWallet,
    connectBurner,
    disconnect,
    switchChain,
    isConnecting,
  };
}

/** Discovered injected EVM wallets (EIP-6963), updated as wallets announce. */
export function useInjectedWallets(): DiscoveredWallet[] {
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  useEffect(() => discoverWallets(setWallets), []);
  return wallets;
}
