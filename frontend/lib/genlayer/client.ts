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

let client: ReturnType<typeof createClient> | null = null;
let burnerAddress: `0x${string}` | null = null;

/**
 * Lazily created GenLayer client with a persistent burner account.
 * Swap the account for a wallet-backed one when MetaMask connect lands.
 */
export function getGenLayerClient() {
  if (!client) {
    const account = createAccount(getBurnerKey());
    burnerAddress = account.address as `0x${string}`;
    client = createClient({ chain: CHAINS[NETWORK], account });
  }
  return client;
}

/** The persistent burner wallet address (stable across reloads). */
export function getBurnerAddress(): string {
  if (!burnerAddress) getGenLayerClient();
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
