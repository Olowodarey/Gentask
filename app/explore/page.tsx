"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBatches } from "@/hooks/use-batches";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils/format";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/utils/animation";
import { Loader2 } from "lucide-react";

export default function ExplorePage() {
  const [filters, setFilters] = useState({});
  const { batches, loading, error } = useBatches(filters);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Explore Review Batches</h1>
        <p className="text-lg text-muted-foreground">
          Browse active code review competitions and find your next opportunity
        </p>
      </div>

      {/* Filters will go here - for now, just show all batches */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${batches.length} batches found`}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Grid</Button>
          <Button variant="ghost" size="sm">List</Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">Failed to load batches. Please try again.</p>
        </div>
      )}

      {!loading && !error && batches.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">No batches found. Try adjusting your filters.</p>
        </div>
      )}

      {!loading && !error && batches.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {batches.map((batch) => (
            <motion.div key={batch.id} variants={fadeInUp}>
              <Link href={`/batches/${batch.id}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">{batch.projectLogo}</div>
                      <Badge
                        variant={
                          batch.status === "paid"
                            ? "default"
                            : batch.status === "judging"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {batch.status.replace(/-/g, " ")}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{batch.projectName}</CardTitle>
                    <CardDescription className="capitalize">
                      {batch.rubric.template.replace(/-/g, " ")} • {batch.selectedPRs.length} PRs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {formatCurrency(batch.rewardPool)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {batch.stablecoin} on {batch.chain.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {batch.status === "paid" ? "Completed" : formatTimeRemaining(batch.deadline)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {batch.status === "paid" ? "" : "remaining"}
                          </div>
                        </div>
                      </div>
                      
                      {batch.payoutMode === "top-3-split" && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-yellow-500" />
                              50%
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-gray-400" />
                              30%
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-orange-600" />
                              20%
                            </span>
                            <span>Top 3 Split</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
