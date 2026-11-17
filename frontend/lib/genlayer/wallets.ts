// EIP-6963 multi-wallet discovery — lets every injected EVM wallet (MetaMask,
// OKX, Rabby, Coinbase, …) announce itself so the user can pick one, instead of
// fighting over the single `window.ethereum` slot.

export type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

export type WalletInfo = { uuid: string; name: string; icon: string; rdns: string };
export type DiscoveredWallet = { info: WalletInfo; provider: EIP1193Provider };

type AnnounceDetail = { info: WalletInfo; provider: EIP1193Provider };

/**
 * Start listening for EIP-6963 providers. Calls `onChange` with the current list
 * whenever a wallet announces itself. Returns an unsubscribe function.
 */
export function discoverWallets(onChange: (wallets: DiscoveredWallet[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const byUuid = new Map<string, DiscoveredWallet>();

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<AnnounceDetail>).detail;
    if (!detail?.info?.uuid) return;
    byUuid.set(detail.info.uuid, { info: detail.info, provider: detail.provider });
    onChange([...byUuid.values()]);
  };

  window.addEventListener("eip6963:announceProvider", handler as EventListener);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return () => window.removeEventListener("eip6963:announceProvider", handler as EventListener);
}

/** Legacy fallback: a wallet injected the old way, with no EIP-6963 announcement. */
export function getLegacyProvider(): EIP1193Provider | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: EIP1193Provider }).ethereum ?? null;
}
