"use client";

import { Suspense, use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  reviewBatchContract,
  type OnChainBatchInfo,
  type OnChainPR,
  type OnChainResult,
  type OnChainPayout,
} from "@/lib/services/review-batch-contract";
import { formatAddress } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  Loader2,
  Lock,
  Plus,
  Gavel,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  open: "bg-primary/15 text-primary",
  judged: "bg-green-500/15 text-green-500",
  "no-winner": "bg-destructive/15 text-destructive",
};

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function BatchDetailPage({ params }: PageProps<"/batches/[address]">) {
  return (
    <Suspense fallback={<Spinner />}>
      <BatchDetail params={params} />
    </Suspense>
  );
}

function BatchDetail({ params }: { params: PageProps<"/batches/[address]">["params"] }) {
  const { address } = use(params);

  const [info, setInfo] = useState<OnChainBatchInfo | null>(null);
  const [prs, setPrs] = useState<OnChainPR[]>([]);
  const [result, setResult] = useState<OnChainResult | null>(null);
  const [payout, setPayout] = useState<OnChainPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [prUrl, setPrUrl] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const i = await reviewBatchContract.getBatchInfo(address);
      setInfo(i);
      setPrs(await reviewBatchContract.getPRs(address));
      if (i.status === "judged") {
        setResult(await reviewBatchContract.getResult(address));
        setPayout(await reviewBatchContract.getPayoutPlan(address));
      }
    } catch (e) {
      setError((e as Error)?.message ?? "Could not load this batch.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    const t = toast.loading(label + "…");
    try {
      await fn();
      toast.success(label + " confirmed", { id: t });
      await load();
    } catch (e) {
      toast.error((e as Error)?.message ?? label + " failed", { id: t });
    } finally {
      setBusy(null);
    }
  };

  const addPr = () =>
    run("Add PR", async () => {
      if (!/\/pull\/\d+/.test(prUrl)) throw new Error("Paste a PR URL like https://github.com/o/r/pull/12");
      await reviewBatchContract.addPR(prUrl.trim(), address);
      setPrUrl("");
    });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Batch not found</h1>
        <p className="mt-2 text-muted-foreground">{error ?? "No contract at this address."}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{address}</p>
      </div>
    );
  }

  const locked = info.rubric.locked;
  const allGatesRun = prs.length > 0 && prs.every((p) => p.gates !== null);
  const winnerIndex = result?.winner;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold">{info.repo}</h1>
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLE[info.status])}>
            {info.status}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{address}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>Maintainer <span className="font-mono text-foreground">{formatAddress(info.maintainer)}</span></span>
          <span>Reward <span className="text-foreground">{info.reward_pool}</span></span>
          <span>Payout <span className="text-foreground">{info.payout_mode}</span></span>
        </div>
      </div>

      {/* Rubric */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Rubric · {info.rubric.template}
            {locked && <Lock className="h-4 w-4 text-primary" />}
          </CardTitle>
          <CardDescription>{locked ? "Locked — immutable" : "Editable until the batch is locked"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {info.rubric.criteria.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                {c}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Add PR + lock (draft only) */}
      {!locked && (
        <Card>
          <CardHeader>
            <CardTitle>Add pull requests</CardTitle>
            <CardDescription>Up to 15 open PRs from {info.repo}. Each is pinned to its head SHA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                data-testid="add-pr-input"
                placeholder={`https://github.com/${info.repo}/pull/1`}
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                className="font-mono"
              />
              <Button data-testid="add-pr-btn" onClick={addPr} disabled={busy !== null}>
                {busy === "Add PR" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null || prs.length === 0}
              onClick={() => run("Lock batch", () => reviewBatchContract.lock(address))}
            >
              <Lock className="mr-2 h-4 w-4" /> Lock batch ({prs.length}/15 PRs)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* PR list */}
      <Card>
        <CardHeader>
          <CardTitle>Pull requests ({prs.length})</CardTitle>
          {locked && (
            <CardDescription>
              Run the objective gates on each PR, then judge. {allGatesRun ? "All gates run." : "Gates pending."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {prs.length === 0 && <p className="text-sm text-muted-foreground">No PRs added yet.</p>}
          {prs.map((pr) => {
            const passed = pr.gates?.passed;
            const isWinner = winnerIndex === pr.index;
            return (
              <div
                key={pr.index}
                className={cn(
                  "rounded-lg border p-3",
                  isWinner ? "border-green-500/50 bg-green-500/5" : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isWinner && <Trophy className="h-4 w-4 text-green-500" />}
                      <a
                        href={`https://github.com/${info.repo}/pull/${pr.number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate font-medium hover:text-primary"
                      >
                        #{pr.number} {pr.title}
                        <ExternalLink className="ml-1 inline h-3 w-3" />
                      </a>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      @{pr.author} · <span className="font-mono">{pr.pinned_sha.slice(0, 10)}</span>
                    </div>
                  </div>
                  {locked && pr.gates === null && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => run(`Gates on #${pr.number}`, () => reviewBatchContract.runGates(pr.index, address))}
                    >
                      {busy === `Gates on #${pr.number}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Run gates"
                      )}
                    </Button>
                  )}
                  {pr.gates && (
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 text-xs font-medium",
                        passed ? "text-green-500" : "text-destructive"
                      )}
                    >
                      {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {passed ? "Qualified" : "Disqualified"}
                    </span>
                  )}
                </div>
                {pr.gates && !passed && pr.gates.reason && (
                  <p className="mt-2 text-xs text-destructive">{pr.gates.reason}</p>
                )}
                {result && (() => {
                  const r = result.ranking.find((x) => x.pr === pr.index);
                  return r ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Rank {r.rank} · score {r.score} — {r.reason}
                    </p>
                  ) : null;
                })()}
              </div>
            );
          })}

          {locked && info.status === "open" && (
            <Button
              className="w-full"
              disabled={busy !== null || !allGatesRun}
              onClick={() => run("Judge", () => reviewBatchContract.judge(address))}
            >
              <Gavel className="mr-2 h-4 w-4" />
              {allGatesRun ? "Judge PRs" : "Run gates on every PR first"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payout plan */}
      {payout.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payout plan</CardTitle>
            <CardDescription>Computed on-chain. Settlement is a later (bridge) phase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {payout.map((p) => (
              <div key={p.rank} className="flex items-center justify-between text-sm">
                <span>
                  <Badge className="mr-2">#{p.rank}</Badge>
                  PR #{p.pr_number} · @{p.author}
                </span>
                <span className="font-mono">{p.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {info.status === "no-winner" && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          No PR passed the gates, so there is no winner.
        </div>
      )}
    </div>
  );
}
