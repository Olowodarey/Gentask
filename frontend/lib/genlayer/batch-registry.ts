// Client-side registry of deployed batch addresses.
//
// One ReviewBatch contract = one batch, so there is no on-chain index yet.
// Until a BatchRegistry factory contract exists, we track addresses in
// localStorage so the UI can list batches the user has deployed/visited.

import { NETWORK, type GenLayerNetwork } from "./client";

export type RegisteredBatch = {
  address: string;
  repo: string;
  network: GenLayerNetwork;
  createdAt: number;
};

const KEY = "gentask-batches";

function read(): RegisteredBatch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as RegisteredBatch[];
  } catch {
    return [];
  }
}

function write(items: RegisteredBatch[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function rememberBatch(address: string, repo: string): void {
  const items = read().filter((b) => b.address.toLowerCase() !== address.toLowerCase());
  items.unshift({ address, repo, network: NETWORK, createdAt: Date.now() });
  write(items);
}

/** Batches on the currently configured network, newest first. */
export function listBatches(): RegisteredBatch[] {
  return read().filter((b) => b.network === NETWORK);
}

export function forgetBatch(address: string): void {
  write(read().filter((b) => b.address.toLowerCase() !== address.toLowerCase()));
}
