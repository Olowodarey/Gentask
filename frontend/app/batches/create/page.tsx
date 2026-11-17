"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import { RUBRIC_TEMPLATES } from "@/lib/constants/chains";
import { reviewBatchContract } from "@/lib/services/review-batch-contract";
import { getContractSource } from "@/lib/genlayer/contract-source";
import { rememberBatch } from "@/lib/genlayer/batch-registry";
import { NETWORK_LABEL, NETWORK } from "@/lib/genlayer/client";
import { cn } from "@/lib/utils/cn";
import { Lock, Rocket, Loader2 } from "lucide-react";

type TemplateKey = keyof typeof RUBRIC_TEMPLATES;
const TEMPLATE_KEYS = Object.keys(RUBRIC_TEMPLATES) as TemplateKey[];
const PAYOUT_MODES = [
  { id: "winner-takes-all", label: "Winner takes all" },
  { id: "top-3-split", label: "Top 3 split (50/30/20)" },
] as const;

export default function CreateBatchPage() {
  const router = useRouter();
  const [repo, setRepo] = useState("");
  const [template, setTemplate] = useState<TemplateKey>("bug-fix");
  const [criteria, setCriteria] = useState(RUBRIC_TEMPLATES["bug-fix"].criteria.join("\n"));
  const [rewardPool, setRewardPool] = useState("1000000000");
  const [payoutMode, setPayoutMode] =
    useState<(typeof PAYOUT_MODES)[number]["id"]>("winner-takes-all");
  const [deploying, setDeploying] = useState(false);

  const pickTemplate = (key: TemplateKey) => {
    setTemplate(key);
    setCriteria(RUBRIC_TEMPLATES[key].criteria.join("\n"));
  };

  // Accept either "owner/name" or a full GitHub URL; normalize to "owner/name".
  const normalizedRepo = (() => {
    const parts = repo
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
      .replace(/\.git$/i, "")
      .split("/")
      .filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : "";
  })();

  const valid =
    /^[^/\s]+\/[^/\s]+$/.test(normalizedRepo) &&
    criteria.trim().length > 0 &&
    Number(rewardPool) > 0;

  const deploy = async () => {
    if (!valid) {
      toast.error('Enter a repo like "owner/name" or its GitHub URL, criteria, and a reward pool.');
      return;
    }
    setDeploying(true);
    const t = toast.loading("Deploying batch contract to " + NETWORK_LABEL[NETWORK] + "…");
    try {
      const code = await getContractSource();
      const { contractAddress } = await reviewBatchContract.deploy({
        code,
        repo: normalizedRepo,
        rubricTemplate: template,
        rubricCriteria: criteria.split("\n").map((c) => c.trim()).filter(Boolean),
        rewardPool: BigInt(rewardPool),
        payoutMode,
      });
      if (!contractAddress) throw new Error("Deployed, but could not read the contract address.");
      rememberBatch(contractAddress, normalizedRepo);
      toast.success("Batch deployed!", { id: t });
      router.push(`/batches/${contractAddress}`);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Deploy failed", { id: t });
      setDeploying(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold tracking-tight">Create a review batch</h1>
          <p className="mt-2 text-muted-foreground">
            Deploy a new ReviewBatch contract on{" "}
            <span className="text-foreground">{NETWORK_LABEL[NETWORK]}</span>. You become its
            maintainer, then add PRs, lock, run the gates, and judge — all on-chain.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GitHub repository</CardTitle>
              <CardDescription>
                Paste the repo URL or type <span className="font-mono">owner/name</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="https://github.com/owner/name  or  owner/name"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="font-mono"
              />
              {repo.trim() && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {normalizedRepo ? (
                    <>Repo: <span className="font-mono text-foreground">{normalizedRepo}</span></>
                  ) : (
                    <span className="text-destructive">Couldn&apos;t read owner/name from that.</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rubric</CardTitle>
              <CardDescription>
                Pick a template, then edit the criteria. This locks when you lock the batch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => pickTemplate(key)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      template === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {RUBRIC_TEMPLATES[key].name}
                  </button>
                ))}
              </div>
              <textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={5}
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary"
                placeholder="One criterion per line"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reward & payout</CardTitle>
              <CardDescription>Reward pool is in base units of the reward token.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                min={1}
                value={rewardPool}
                onChange={(e) => setRewardPool(e.target.value)}
                className="font-mono"
              />
              <div className="flex flex-wrap gap-2">
                {PAYOUT_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayoutMode(m.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      payoutMode === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 rounded-md border border-border bg-card/50 p-3 text-sm text-muted-foreground">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            The rubric and PR list become immutable once you lock the batch. Deploying costs a
            transaction from your connected burner wallet.
          </div>

          <Button onClick={deploy} disabled={deploying || !valid} size="lg" className="w-full">
            {deploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying…
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" /> Deploy batch
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
