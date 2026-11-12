import { useWalletStore } from "@/lib/store/wallet-store";

export function useWallet() {
  const { connected, address, balance, chainId, connect, disconnect, switchChain, isConnecting } = useWalletStore();

  return {
    connected,
    address,
    balance,
    chainId,
    connect,
    disconnect,
    switchChain,
    isConnecting,
  };
}
