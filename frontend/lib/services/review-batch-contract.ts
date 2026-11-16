import { TransactionStatus, type Address, type TransactionHash } from "genlayer-js/types";
import { getGenLayerClient, REVIEW_BATCH_ADDRESS } from "@/lib/genlayer/client";

// On-chain shapes returned by ReviewBatch.py views (contracts/ReviewBatch.py)
export type OnChainBatchInfo = {
  repo: string;
  maintainer: string;
  rubric: { template: string; criteria: string[]; locked: boolean };
  reward_pool: string;
  payout_mode: "winner-takes-all" | "top-3-split";
  status: "draft" | "open" | "judged" | "no-winner";
  pr_count: number;
};

export type OnChainGates = {
  gates: Record<string, boolean>;
  passed: boolean;
  reason: string | null;
};

export type OnChainPR = {
  index: number;
  number: number;
  pinned_sha: string;
  author: string;
  title: string;
  gates: OnChainGates | null;
};

export type OnChainRanking = { pr: number; score: number; rank: number; reason: string };

export type OnChainResult = { winner: number | null; ranking: OnChainRanking[] };

export type OnChainPayout = {
  rank: number;
  pr_index: number;
  pr_number: number;
  author: string;
  amount: string;
};

function address(override?: string): Address {
  const addr = override ?? REVIEW_BATCH_ADDRESS;
  if (!addr) {
    throw new Error(
      "No ReviewBatch contract address. Set NEXT_PUBLIC_REVIEWBATCH_ADDRESS in .env.local"
    );
  }
  return addr as Address;
}

async function view<T>(functionName: string, contractAddress?: string): Promise<T> {
  const client = getGenLayerClient();
  const raw = await client.readContract({
    address: address(contractAddress),
    functionName,
    args: [],
  });
  return JSON.parse(raw as string) as T;
}

async function write(
  functionName: string,
  args: (string | number | bigint)[],
  contractAddress?: string
): Promise<TransactionHash> {
  const client = getGenLayerClient();
  const hash = await client.writeContract({
    address: address(contractAddress),
    functionName,
    args,
    value: BigInt(0),
  });
  await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.ACCEPTED,
  });
  return hash;
}

export const reviewBatchContract = {
  // ---- views ----
  getBatchInfo: (addr?: string) => view<OnChainBatchInfo>("get_batch_info", addr),
  getPRs: (addr?: string) => view<OnChainPR[]>("get_prs", addr),
  getResult: async (addr?: string): Promise<OnChainResult | null> => {
    const client = getGenLayerClient();
    const raw = await client.readContract({
      address: address(addr),
      functionName: "get_result",
      args: [],
    });
    return raw ? (JSON.parse(raw as string) as OnChainResult) : null;
  },
  getPayoutPlan: (addr?: string) => view<OnChainPayout[]>("get_payout_plan", addr),

  // ---- writes (maintainer unless noted) ----
  addPR: (prUrl: string, addr?: string) => write("add_pr", [prUrl], addr),
  lock: (addr?: string) => write("lock", [], addr),
  runGates: (index: number, addr?: string) => write("run_gates", [BigInt(index)], addr),
  judge: (addr?: string) => write("judge", [], addr),

  // Deploy a new batch; returns the tx hash (contract address is in the receipt)
  deploy: async (params: {
    code: string;
    repo: string;
    rubricTemplate: string;
    rubricCriteria: string[];
    rewardPool: bigint;
    payoutMode: "winner-takes-all" | "top-3-split";
  }): Promise<{ txHash: TransactionHash; contractAddress: string | null }> => {
    const client = getGenLayerClient();
    const txHash = (await client.deployContract({
      code: params.code,
      args: [
        params.repo,
        params.rubricTemplate,
        params.rubricCriteria.join("\n"),
        params.rewardPool,
        params.payoutMode,
      ],
    })) as TransactionHash;
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.ACCEPTED,
    });
    const contractAddress =
      (receipt.data as { contract_address?: string } | undefined)?.contract_address ?? null;
    return { txHash, contractAddress };
  },
};
