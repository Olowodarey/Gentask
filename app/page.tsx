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
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import {
  ArrowRight,
  Code,
  Trophy,
  Zap,
  Shield,
  Check,
  Users,
  Rocket,
} from "lucide-react";
import { useBatches } from "@/hooks/use-batches";
import { useSession } from "@/hooks/use-session";
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
      description: "Choose up to 15 existing pull requests from your project",
    },
    {
      icon: Zap,
      title: "Set Reward & Rubric",
      description:
        "Define the reward pool and evaluation criteria that locks on creation",
    },
    {
      icon: Shield,
      title: "AI Validators Judge",
      description:
        "GenLayer validators analyze code quality and reach consensus",
    },
    {
      icon: Trophy,
      title: "Winner Gets Paid",
      description: "Best PR wins the reward, paid instantly on-chain",
    },
  ];

  const contributorSteps = [
    {
      icon: Code,
      title: "Submit Quality PRs",
      description: "Work on existing issues in projects you care about",
    },
    {
      icon: Shield,
      title: "Get Selected",
      description: "Maintainers add your PR to a paid review batch",
    },
    {
      icon: Trophy,
      title: "AI Reviews Your Work",
      description: "GenLayer validators judge against locked criteria",
    },
    {
      icon: Zap,
      title: "Earn Rewards",
      description: "Top PRs get paid based on quality and fit",
    },
  ];

  const steps =
    selectedRole === "maintainer" ? maintainerSteps : contributorSteps;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-accent/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
            >
              AI-Validated Code Review Competitions
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              Maintainers: reward quality contributions. Contributors: earn for
              your work. GenLayer AI validators judge every PR fairly.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild>
                <Link href="/sign-in">
                  <Users className="mr-2 h-4 w-4" />I want to contribute
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">
                  <Rocket className="mr-2 h-4 w-4" />I maintain a project
                </Link>
              </Button>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-xs text-muted-foreground"
            >
              You'll start as a contributor and can switch to maintainer mode
              anytime.
            </motion.p>

            {isSignedIn && (
              <motion.div variants={fadeInUp} className="mt-6">
                <Button variant="secondary" asChild>
                  <Link href={`/${activeRole}/overview`}>
                    Go to my {activeRole} dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* How It Works with Role Toggle */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How Gentask Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Four simple steps from selection to payout
            </p>

            {/* Role Toggle */}
            <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted p-1">
              <button
                onClick={() => setSelectedRole("contributor")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedRole === "contributor"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Contributors
              </button>
              <button
                onClick={() => setSelectedRole("maintainer")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedRole === "maintainer"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Maintainers
              </button>
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
              <motion.div key={index} variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{step.title}</CardTitle>
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

      {/* Benefits for Contributors */}
      <section className="border-y border-border/40 bg-accent/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h3 className="text-2xl font-bold">For Contributors</h3>
            <p className="mt-2 text-muted-foreground">
              Get paid for quality work
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fair Evaluation",
                desc: "AI validators judge objectively against locked criteria",
              },
              {
                title: "Instant Payouts",
                desc: "Winners get paid on-chain immediately after judging",
              },
              {
                title: "Build Reputation",
                desc: "Every win increases your reputation score",
              },
            ].map((benefit, i) => (
              <Card key={i}>
                <CardHeader>
                  <Check className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {benefit.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Maintainers */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h3 className="text-2xl font-bold">For Maintainers</h3>
            <p className="mt-2 text-muted-foreground">
              Reward your best contributors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Incentivize Quality",
                desc: "Reward PRs that truly improve your project",
              },
              {
                title: "Transparent Process",
                desc: "AI validates work objectively, no bias",
              },
              {
                title: "Campaign Funding",
                desc: "Apply for grants or join sponsored campaigns",
              },
            ].map((benefit, i) => (
              <Card key={i}>
                <CardHeader>
                  <Check className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {benefit.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="border-y border-border/40 bg-accent/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Batches", value: 247, prefix: "" },
              { label: "Total Paid", value: 1847000, prefix: "$" },
              { label: "Active Contributors", value: 892, prefix: "" },
              { label: "Avg Review Time", value: 18, suffix: "h" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stat.prefix}
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Batches */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Review Batches
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              High-value batches open now
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBatches.map((batch) => (
              <Link key={batch.id} href={`/explore/${batch.id}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{batch.projectLogo}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeRemaining(batch.deadline)} left
                      </div>
                    </div>
                    <CardTitle className="mt-2">{batch.projectName}</CardTitle>
                    <CardDescription className="capitalize">
                      {batch.rubric.template} Challenge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(batch.rewardPool)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {batch.stablecoin} Reward
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
          <div className="mt-10 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/explore">View All Batches</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-accent/5 to-background py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join Gentask today and start earning rewards for quality
            contributions
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/sign-in">Get Started</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/explore">Explore Batches</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
