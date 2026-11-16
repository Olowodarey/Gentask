"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { prService } from "@/lib/services/pr-service";
import { batchService } from "@/lib/services/batch-service";
import { payoutService } from "@/lib/services/payout-service";
import { authService } from "@/lib/services/auth-service";
import { formatCurrency, formatTimeRemaining, formatSha } from "@/lib/utils/format";
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import { 
  FileText, 
  DollarSign, 
  Award, 
  Target,
  GitPullRequest,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Clock
} from "lucide-react";
import type { PullRequest, ReviewBatch, Payout } from "@/lib/types";

export default function ContributorOverviewPage() {
  const { githubHandle } = useSession();
  const [myPRs, setMyPRs] = useState<Array<{ pr: PullRequest; batch: ReviewBatch; rank?: number; reason?: string }>>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    prsUnderReview: 0,
    totalEarned: 0,
    wins: 0,
    winRate: 0,
    reputation: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const prsData = await prService.getContributorPRs(githubHandle || "tunde-codes");
        
        const prsWithBatches = await Promise.all(
          prsData.map(async (item) => {
            const batch = await batchService.getBatch(item.batchId);
            return { ...item, batch: batch! };
          })
        );
        
        setMyPRs(prsWithBatches);

        const payoutsData = await payoutService.getPayoutsForContributor("tunde");
        setPayouts(payoutsData);

        const personaData = authService.getPersonaData("tunde");
        if (personaData && "earnings" in personaData) {
          setStats({
            prsUnderReview: prsWithBatches.filter((item: { batch: ReviewBatch }) => !["paid", "disputed"].includes(item.batch.status)).length,
            totalEarned: personaData.earnings,
            wins: personaData.wins,
            winRate: personaData.winRate,
            reputation: personaData.reputation,
          });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [githubHandle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const claimablePayouts = payouts.filter(p => p.status === "claimable");

  return (
    <div className="space-y-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold">Welcome back, {githubHandle}!</h1>
        <p className="text-muted-foreground mt-1">Track your PRs, earnings, and reputation</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-primary mb-4" />
              <div className="text-2xl font-bold">{stats.prsUnderReview}</div>
              <div className="text-xs text-muted-foreground mt-1">PRs Under Review</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-primary mb-4" />
              <div className="text-2xl font-bold">{formatCurrency(stats.totalEarned)}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Earned</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-primary mb-4" />
              <div className="text-2xl font-bold">{stats.wins}</div>
              <div className="text-xs text-muted-foreground mt-1">Wins</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mb-4" />
              <div className="text-2xl font-bold">{Math.round(stats.winRate * 100)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Win Rate</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <div className="text-2xl font-bold">{stats.reputation}</div>
              <div className="text-xs text-muted-foreground mt-1">Reputation</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {claimablePayouts.length > 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Claimable Payouts
              </CardTitle>
              <CardDescription>You have rewards ready to claim!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claimablePayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 rounded-lg border bg-accent/50">
                    <div>
                      <div className="font-medium">{formatCurrency(payout.amount)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Batch #{payout.batchId} • {payout.stablecoin} on {payout.chain.name}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/contributor/earnings">Claim Now</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My PRs Under Review</CardTitle>
                <CardDescription className="mt-1">
                  Your pull requests that maintainers selected for review batches
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/contributor/my-prs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myPRs.length === 0 ? (
              <div className="text-center py-12">
                <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No PRs under review yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep contributing! Maintainers may select your PRs for paid review batches.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPRs.slice(0, 5).map((item) => (
                  <div
                    key={item.pr.id}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            item.batch.status === "paid" ? "default" :
                            item.batch.status === "judging" ? "secondary" :
                            "outline"
                          }>
                            {item.batch.status.replace(/-/g, " ")}
                          </Badge>
                          {item.rank && (
                            <Badge variant="outline" className="bg-primary/10">
                              Rank #{item.rank}
                            </Badge>
                          )}
                          {item.pr.gateResults?.every(g => g.passed) && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {item.pr.disqualified && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.pr.projectName}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">PR #{item.pr.number}</span>
                        </div>

                        <h3 className="font-medium text-sm mb-2 truncate">{item.pr.title}</h3>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span className="font-mono">{formatSha(item.pr.headSha)}</span>
                          </div>
                          {item.batch.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeRemaining(item.batch.deadline)} left</span>
                            </div>
                          )}
                        </div>

                        {item.reason && (
                          <div className="mt-3 p-3 rounded-md bg-muted text-sm">
                            <div className="font-medium text-xs text-muted-foreground mb-1">Validator Feedback:</div>
                            <p className="text-foreground">{item.reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(item.batch.rewardPool)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.batch.payoutMode === "winner-takes-all" ? "Winner takes all" : "Top 3 split"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Explore Batches</CardTitle>
              <CardDescription>Browse active review competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/explore">Browse</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Leaderboard</CardTitle>
              <CardDescription>See top contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/leaderboard">View Rankings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">My Profile</CardTitle>
              <CardDescription>Manage your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contributor/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
