"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import { ArrowLeft, Compass, Hammer } from "lucide-react";

const ROADMAP = [
  "Batch detail — live reads from a deployed ReviewBatch contract",
  "Create Batch — wizard that deploys a new batch on GenLayer",
  "Dashboard, Leaderboard, Campaigns & Grants",
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/15%),transparent_60%)]" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-xl text-center"
      >
        <motion.div
          variants={fadeInUp}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card"
        >
          <Hammer className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.p variants={fadeInUp} className="text-sm font-medium text-primary">
          Coming soon
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          This page is under construction
        </motion.h1>

        <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground">
          Gentask v1 ships the review-batch flow first. This part of the product is on
          the roadmap and not built yet — here&apos;s what&apos;s next:
        </motion.p>

        <motion.ul
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-muted-foreground"
        >
          {ROADMAP.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild>
            <Link href="/explore">
              <Compass className="mr-2 h-4 w-4" />
              Explore batches
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
