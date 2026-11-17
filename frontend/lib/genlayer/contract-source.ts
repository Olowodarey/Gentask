// The ReviewBatch contract source, served from public/ (synced from contracts/
// by scripts/sync-contract.mjs). deployContract() needs the raw source string.

let cached: string | null = null;

export async function getContractSource(): Promise<string> {
  if (cached) return cached;
  const res = await fetch("/ReviewBatch.py");
  if (!res.ok) throw new Error("Could not load contract source (ReviewBatch.py)");
  cached = await res.text();
  return cached;
}
