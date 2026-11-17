"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import { listBatches, type RegisteredBatch } from "@/lib/genlayer/batch-registry";
import { NETWORK_LABEL, NETWORK } from "@/lib/genlayer/client";
import { formatAddress } from "@/lib/utils/format";
import { Plus, ArrowRight, FlaskConical } from "lucide-react";

const DEMO_ADDRESS = "0x2f16499eD158BDb053A34ADe7dA5208c113d6e9c";

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<RegisteredBatch[]>([]);
  const [addr, setAddr] = useState("");

  useEffect(() => {
    setBatches(listBatches());
  }, []);

  const open = () => {
    const a = addr.trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(a)) router.push(`/batches/${a}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review batches</h1>
            <p className="mt-1 text-muted-foreground">
              Deployed on {NETWORK_LABEL[NETWORK]}. Batches you deploy are remembered in this browser.
            </p>
          </div>
          <Button asChild>
            <Link href="/batches/create">
              <Plus className="mr-2 h-4 w-4" /> Create
            </Link>
          </Button>
        </motion.div>

        {/* Judges: try the live demo */}
        <motion.div variants={fadeInUp} className="mt-6">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Reviewing this project? Try the live contract</p>
                  <p className="text-sm text-muted-foreground">
                    A deployed ReviewBatch on studionet you can read end-to-end.
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/batches/${DEMO_ADDRESS}`}>
                  Open <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Open by address */}
        <motion.div variants={fadeInUp} className="mt-6 flex gap-2">
          <Input
            placeholder="Open a batch by contract address (0x…)"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && open()}
            className="font-mono"
          />
          <Button variant="outline" onClick={open}>
            Open
          </Button>
        </motion.div>

        {/* Remembered batches */}
        <motion.div variants={fadeInUp} className="mt-8 space-y-3">
          {batches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No batches yet. Create one to drive the full flow on-chain.
            </p>
          ) : (
            batches.map((b) => (
              <Link key={b.address} href={`/batches/${b.address}`}>
                <Card className="transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-mono font-medium">{b.repo}</p>
                      <p className="font-mono text-xs text-muted-foreground">{formatAddress(b.address)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
