"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { fadeInUp, staggerContainer, fadeIn } from "@/lib/utils/animation";
import {
  ArrowRight,
  Code,
  Trophy,
  Zap,
  Shield,
  Check,
  Users,
  Rocket,
  Scale,
  Eye,
  Gavel,
  MessageSquareWarning,
  Lock,
  CheckCircle2,
  Sparkles,
  Coins,
  Landmark,
} from "lucide-react";
import { useBatches } from "@/hooks/use-batches";
import { useSession } from "@/hooks/use-session";
import { CHAINS, STABLECOINS } from "@/lib/constants/chains";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export default function HomePage() {
  const { batches } = useBatches({ status: "open" });
  const { isSignedIn, activeRole } = useSession();
  const featuredBatches = batches.slice(0, 3);
  const [selectedRole, setSelectedRole] = useState<
    "maintainer" | "contributor"
  >("contributor");

  const maintainerSteps = [
    {
      icon: Code,
      title: "Select PRs",
      description: "Choose up to 15 existing pull requests from your project.",
    },
    {
      icon: Zap,
      title: "Set reward & rubric",
      description:
        "Pick the reward, chain, and criteria. The rubric locks on creation.",
    },
    {
      icon: Shield,
      title: "Validators judge",
      description:
        "Independent GenLayer validators compare PRs and reach consensus.",
    },
    {
      icon: Trophy,
      title: "Winner gets paid",
      description: "The reward is released on-chain — no manual negotiation.",
    },
  ];

  const contributorSteps = [
    {
      icon: Code,
      title: "Do the work",
      description: "Open PRs on the projects you already care about.",
    },
    {
      icon: Shield,
      title: "Get selected",
      description: "A maintainer adds your PR to a paid review batch.",
    },
    {
      icon: Gavel,
      title: "Get judged fairly",
      description: "Validators rank your PR against a public, locked rubric.",
    },
    {
      icon: Trophy,
      title: "Earn & appeal",
      description: "Win the reward, see the reasons, and contest if it's wrong.",
    },
  ];

  const steps =
    selectedRole === "maintainer" ? maintainerSteps : contributorSteps;

  const principles = [
    {
      icon: Scale,
      title: "Fair",
      desc: "The rules are fixed before anyone is judged.",
    },
    {
      icon: Eye,
      title: "Transparent",
      desc: "Every ranking comes with a short, written reason.",
    },
    {
      icon: Users,
      title: "Neutral",
      desc: "A panel of independent validators decides — not one person.",
    },
    {
      icon: MessageSquareWarning,
      title: "Contestable",
      desc: "Disagree with the result? You can file an appeal.",
    },
  ];

  const contributorBenefits = [
    "Your PRs get a clear rank with written reasons — never silence",
    "Winners are paid in stablecoins, straight to your wallet",
    "Pinned commits mean no one can move the goalposts after selection",
    "Build an on-chain reputation score with every batch",
    "Appeal any result you believe is wrong",
  ];

  const maintainerBenefits = [
    "Reward your best contributors without refereeing every payout",
    "Lock a public rubric up front — no accusations of favoritism",
    "Objective gates filter out drafts, failing CI, and oversized diffs",
    "Funds sit in escrow and release automatically to the winner",
    "Choose winner-takes-all or a top-3 split",
  ];

  const faqs = [
    {
      q: "Do contributors submit PRs on Gentask?",
      a: "No. Gentask works on PRs that already exist in the maintainer's project. The maintainer picks which ones enter a paid batch.",
    },
    {
      q: "Can the maintainer pick the winner themselves?",
      a: "No. Maintainers choose which PRs enter and set the rubric — but the independent validators pick the winner.",
    },
    {
      q: "Where is the money held?",
      a: "Rewards are held in escrow on the chain the maintainer picks, and paid out automatically when the result is final.",
    },
    {
      q: "What if I think the result is wrong?",
      a: "Objective checks run first, the rubric is locked, several validators must agree, and you can file an appeal.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f26_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f26_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_110%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[500px] rounded-full bg-aqua/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:px-8">
          {/* Left: copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Judged by AI validators on GenLayer
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Open-source work,{" "}
              <span className="bg-gradient-to-r from-primary to-aqua bg-clip-text text-transparent">
                judged fairly
              </span>
              , paid on-chain.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              Maintainers put up to 15 pull requests into a paid review. A panel
              of independent validators picks the best one against a public
              rubric. The winner is paid from escrow — and everyone can see why.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" asChild>
                <Link href="/sign-in">
                  <Users className="h-4 w-4" />
                  I want to contribute
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">
                  <Rocket className="h-4 w-4" />
                  I maintain a project
                </Link>
              </Button>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mt-4 text-xs text-muted-foreground"
            >
              You start as a contributor and can switch to maintainer mode
              anytime.
            </motion.p>

            {isSignedIn && (
              <motion.div variants={fadeInUp} className="mt-6">
                <Button variant="secondary" asChild>
                  <Link href={`/${activeRole}/overview`}>
                    Go to my {activeRole} dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right: product mockup — a judging result */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/25 via-transparent to-aqua/15 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur">
              {/* card header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="text-sm font-semibold">
                    nextjs · Bug Fix Batch
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Rubric locked · 5 PRs · Escrow on Base
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua/10 px-2.5 py-1 text-xs font-medium text-aqua">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Consensus
                </span>
              </div>

              {/* validators */}
              <div className="flex items-center gap-2 py-4">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-gradient-to-br from-primary/70 to-aqua/40 text-[10px] font-bold text-primary-foreground"
                    >
                      V{i + 1}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  5 independent validators agreed
                </span>
              </div>

              {/* ranked PRs */}
              <div className="space-y-2.5">
                {[
                  {
                    rank: 1,
                    title: "Fix race condition in router cache",
                    author: "zara-builds",
                    reason: "Root-cause fix, focused diff, regression test added.",
                    win: true,
                  },
                  {
                    rank: 2,
                    title: "Guard against null in prefetch",
                    author: "tunde-codes",
                    reason: "Correct but broader than needed; partial coverage.",
                  },
                  {
                    rank: 3,
                    title: "Patch symptom in navigation hook",
                    author: "ada-maintains",
                    reason: "Addresses symptom, not the underlying cause.",
                  },
                ].map((pr) => (
                  <div
                    key={pr.rank}
                    className={cn(
                      "rounded-xl border p-3 transition-colors",
                      pr.win
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-background/40"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                          pr.win
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {pr.rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {pr.title}
                          </span>
                          {pr.win && (
                            <span className="shrink-0 rounded-full bg-aqua/15 px-2 py-0.5 text-[10px] font-semibold text-aqua">
                              +$5,000 USDC
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          @{pr.author}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {pr.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live stats — what's happening right now */}
      <section className="border-b border-border/40 bg-accent/5 py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            Happening on Gentask right now
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { label: "Review batches", value: 247, prefix: "" },
              { label: "Paid to contributors", value: 1847000, prefix: "$" },
              { label: "Active contributors", value: 892, prefix: "" },
              { label: "Avg review time", value: 18, suffix: "h" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold sm:text-4xl">
                  <span className="bg-gradient-to-r from-primary to-aqua bg-clip-text text-transparent">
                    {stat.prefix}
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles / trust */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A decision you can trust
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Paying for open-source work usually hinges on one person&apos;s
              call. Gentask makes it fair, transparent, neutral, and
              contestable.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {principles.map((p) => (
              <motion.div key={p.title} variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <p.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-lg">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works — role toggle */}
      <section className="border-y border-border/40 bg-accent/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How Gentask works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Four steps from selection to payout.
            </p>

            <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted p-1">
              {(["contributor", "maintainer"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium capitalize transition-all",
                    selectedRole === role
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {role}s
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={selectedRole}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-3xl font-bold text-border">
                        {index + 1}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits — side by side */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Something for both sides
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Contributors get paid fairly. Maintainers stop playing referee.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contributors */}
            <Card className="relative overflow-hidden border-primary/30">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>For contributors</CardTitle>
                    <CardDescription>Get paid for your best PRs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {contributorBenefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 translate-y-0.5 text-aqua" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/sign-in">
                    Start contributing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Maintainers */}
            <Card className="relative overflow-hidden border-aqua/30">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aqua/10 blur-3xl" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-aqua/10">
                    <Rocket className="h-5 w-5 text-aqua" />
                  </div>
                  <div>
                    <CardTitle>For maintainers</CardTitle>
                    <CardDescription>
                      Reward quality without the politics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {maintainerBenefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 translate-y-0.5 text-aqua" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link href="/sign-in">
                    Set up maintainer mode
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chains & payouts */}
      <section className="border-y border-border/40 bg-accent/5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              On-chain, on your chain
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Judging runs on GenLayer. Rewards are escrowed and paid in
              stablecoins on the chain the maintainer picks.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {Object.values(CHAINS).map((chain) => (
              <motion.div key={chain.id} variants={fadeInUp}>
                <Card className="h-full text-center transition-colors hover:border-primary/40">
                  <CardContent className="flex flex-col items-center gap-2 pt-6">
                    <span className="text-4xl">{chain.logo}</span>
                    <span className="font-semibold">{chain.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {chain.symbol}
                    </span>
                    {chain.testnet && (
                      <span className="rounded-full bg-aqua/10 px-2 py-0.5 text-[10px] font-medium text-aqua">
                        Judging layer
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Landmark,
                title: "Escrowed up front",
                desc: "The reward pool is locked in an escrow contract when the batch is created.",
              },
              {
                icon: Coins,
                title: `Paid in ${STABLECOINS.join(", ")}`,
                desc: "Winners claim stablecoins directly to their linked wallet.",
              },
              {
                icon: Shield,
                title: "Judged on GenLayer",
                desc: "Intelligent Contracts run the validator panel and publish the ranking on-chain.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured batches */}
      {featuredBatches.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Open review batches
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                High-value batches being judged right now.
              </p>
            </div>
            <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBatches.map((batch) => (
                <Link key={batch.id} href={`/explore/${batch.id}`}>
                  <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{batch.projectLogo}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRemaining(batch.deadline)} left
                        </div>
                      </div>
                      <CardTitle className="mt-2 group-hover:text-primary">
                        {batch.projectName}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {batch.rubric.template} challenge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {formatCurrency(batch.rewardPool)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {batch.stablecoin} reward
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {batch.selectedPRs.length} PRs
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {batch.chain.name}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/explore">
                  View all batches
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-border/40 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border/40 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[300px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 to-aqua/15 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get paid for your best work?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Sign in with a demo persona and explore both the contributor and
            maintainer apps. No wallet or setup required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/sign-in">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/explore">Explore batches</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
