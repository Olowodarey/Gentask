import { createAccount, createClient, generatePrivateKey } from "genlayer-js";
import { localnet, studionet, testnetAsimov, testnetBradbury } from "genlayer-js/chains";

const CHAINS = {
  localnet,
  studionet,
  "testnet-asimov": testnetAsimov,
  "testnet-bradbury": testnetBradbury,
} as const;

export type GenLayerNetwork = keyof typeof CHAINS;

const NETWORK = (process.env.NEXT_PUBLIC_GENLAYER_NETWORK ?? "studionet") as GenLayerNetwork;

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

/**
 * Lazily created GenLayer client with a persistent burner account.
 * Swap the account for a wallet-backed one when real wallet connect lands.
 */
export function getGenLayerClient() {
  if (!client) {
    client = createClient({
      chain: CHAINS[NETWORK],
      account: createAccount(getBurnerKey()),
    });
  }
  return client;
}
