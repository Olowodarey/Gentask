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

export type WalletMode = "metamask" | "burner";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

let burnerClient: ReturnType<typeof createClient> | null = null;
let metamaskClientInstance: ReturnType<typeof createClient> | null = null;
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
 * The GenLayer client used for all reads and writes. Returns the MetaMask-backed
 * client once connected, otherwise the persistent burner client. Reads work on
 * either; writes are signed by whichever account is active.
 */
export function getGenLayerClient() {
  if (activeMode === "metamask" && metamaskClientInstance) return metamaskClientInstance;
  return makeBurnerClient();
}

export function getWalletMode(): WalletMode {
  return activeMode;
}

function getEthereum(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum ?? null;
}

export function hasMetaMask(): boolean {
  return getEthereum() !== null;
}

/**
 * Connect MetaMask (via the GenLayer Snap) and make it the active signer.
 * Throws if MetaMask is unavailable or the user rejects — callers fall back to
 * the burner account.
 */
export async function connectMetaMask(): Promise<string> {
  const eth = getEthereum();
  if (!eth) throw new Error("MetaMask not detected");
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No MetaMask account authorized");

  const mm = createClient({
    chain: CHAINS[NETWORK],
    account: address as `0x${string}`,
    provider: eth as never,
  });
  // Connect the GenLayer MetaMask Snap so it can sign GenVM transactions.
  await mm.connect();

  metamaskClientInstance = mm;
  activeMode = "metamask";
  return address;
}

/** Switch the active signer back to the burner account. */
export function useBurnerWallet(): void {
  activeMode = "burner";
  metamaskClientInstance = null;
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
