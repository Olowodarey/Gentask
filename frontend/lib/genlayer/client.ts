import { createAccount, createClient, generatePrivateKey } from "genlayer-js";
import { localnet, studionet, testnetAsimov, testnetBradbury } from "genlayer-js/chains";

const CHAINS = {
  localnet,
  studionet,
  "testnet-asimov": testnetAsimov,
  "testnet-bradbury": testnetBradbury,
} as const;

export type GenLayerNetwork = keyof typeof CHAINS;

export const NETWORK = (process.env.NEXT_PUBLIC_GENLAYER_NETWORK ?? "studionet") as GenLayerNetwork;

export const NETWORK_LABEL: Record<GenLayerNetwork, string> = {
  localnet: "GenLayer Localnet",
  studionet: "GenLayer Studio",
  "testnet-asimov": "Asimov Testnet",
  "testnet-bradbury": "Bradbury Testnet",
};

export const REVIEW_BATCH_ADDRESS = process.env.NEXT_PUBLIC_REVIEWBATCH_ADDRESS ?? "";

const BURNER_KEY_STORAGE = "gentask-burner-key";

function getBurnerKey(): `0x${string}` {
  if (typeof window === "undefined") return generatePrivateKey();
  const existing = window.localStorage.getItem(BURNER_KEY_STORAGE);
  if (existing) return existing as `0x${string}`;
  const key = generatePrivateKey();
  window.localStorage.setItem(BURNER_KEY_STORAGE, key);
  return key;
}

import type { EIP1193Provider } from "./wallets";

export type WalletMode = "injected" | "burner";

let burnerClient: ReturnType<typeof createClient> | null = null;
let injectedClient: ReturnType<typeof createClient> | null = null;
let activeMode: WalletMode = "burner";
let burnerAddress: `0x${string}` | null = null;

function makeBurnerClient() {
  if (!burnerClient) {
    const account = createAccount(getBurnerKey());
    burnerAddress = account.address as `0x${string}`;
    burnerClient = createClient({ chain: CHAINS[NETWORK], account });
  }
  return burnerClient;
}

/**
 * The GenLayer client used for all reads and writes. Returns the injected-wallet
 * client once connected, otherwise the persistent burner client. Reads work on
 * either; writes are signed by whichever account is active.
 */
export function getGenLayerClient() {
  if (activeMode === "injected" && injectedClient) return injectedClient;
  return makeBurnerClient();
}

export function getWalletMode(): WalletMode {
  return activeMode;
}

function chainAddParams() {
  const chain = CHAINS[NETWORK] as unknown as {
    id: number;
    name: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
  };
  return {
    chainId: "0x" + chain.id.toString(16),
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: [rpcUrl()],
  };
}

/** Ensure the wallet is on the GenLayer network (add it if unknown). Best-effort. */
async function ensureChain(provider: EIP1193Provider): Promise<void> {
  const params = chainAddParams();
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: params.chainId }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    if (code === 4902 || code === -32603) {
      await provider.request({ method: "wallet_addEthereumChain", params: [params] });
    }
    // other errors (e.g. user rejected switch) are non-fatal for reads/display
  }
}

/**
 * Connect an injected EVM wallet (any EIP-1193 provider: MetaMask, OKX, Rabby,
 * Coinbase, …) and make it the active signer. Throws if the user rejects.
 */
export async function connectInjected(provider: EIP1193Provider): Promise<string> {
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No account authorized");

  await ensureChain(provider);

  injectedClient = createClient({
    chain: CHAINS[NETWORK],
    account: address as `0x${string}`,
    provider: provider as never,
  });
  activeMode = "injected";
  return address;
}

/** Switch the active signer back to the burner account. */
export function useBurnerWallet(): void {
  activeMode = "burner";
  injectedClient = null;
}

/** The persistent burner wallet address (stable across reloads). */
export function getBurnerAddress(): string {
  if (!burnerAddress) makeBurnerClient();
  return burnerAddress as string;
}

function rpcUrl(): string {
  const chain = CHAINS[NETWORK] as unknown as {
    rpcUrls?: { default?: { http?: readonly string[] } };
  };
  return chain.rpcUrls?.default?.http?.[0] ?? "";
}

/** Read the account's GEN balance from chain. Returns 0 on any failure (never throws). */
export async function getGenBalance(address: string): Promise<number> {
  const url = rpcUrl();
  if (!url) return 0;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    });
    const json = (await res.json()) as { result?: string };
    if (!json.result) return 0;
    return Number(BigInt(json.result)) / 1e18;
  } catch {
    return 0;
  }
}
