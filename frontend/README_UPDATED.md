# Gentask Frontend - Role-Based Review Platform

A paid open-source review platform built with Next.js, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Product Model

Gentask works on PRs that **ALREADY EXIST** in the maintainer's project. Contributors do NOT submit PRs through Gentask.

- Maintainers select **up to 15 existing open PRs** to form a paid "Review Batch"
- Rubric locks at batch creation (bug fix, feature, docs, design)
- Each PR is pinned to its head commit SHA
- Hard gates filter PRs: CI green, tests present, diff size, not draft, targets default branch
- AI validators judge and rank all qualifying PRs
- Winner(s) get paid: "Winner takes all" or "Top 3 split" (50/30/20)

## Sign-In & Roles

### Two-Step Sign-In
1. Connect wallet (mock)
2. Connect GitHub (mock)

**Every user starts as a Contributor.** No role selection step.

### Role Switching

- **Contributor App** (default): Dashboard, My PRs, Earnings, Appeals, Profile
- **Maintainer App**: Overview, Batches (create/manage), Projects, Payouts

Access maintainer mode via avatar menu → "Switch to Maintainer". First time requires quick setup. After that, switching is instant with animated layout transition.

### Demo Personas

Three one-click personas for testing:

**Tunde** - Contributor only
- 5 PRs under review, $12,500 earned, 3 wins
- Maintainer mode not set up yet

**Ada** - Maintainer (instant switch)
- 3 active batches, $23,500 in escrow
- 14 PR slots used (out of 15)

**Zara** - Power user (both roles, rich data)
- Contributor: 7 wins, $28,900 earned
- Maintainer: 2 batches, $15,000 in escrow

## Quick Start

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

Try demo personas:
1. Click "Get Started"
2. Sign in with Tunde, Ada, or Zara
3. Explore contributor dashboard
4. Switch to maintainer (if enabled)

## Routes

**Public:** `/`, `/explore`, `/campaigns`, `/grants`, `/leaderboard`, `/sign-in`

**Contributor:** `/contributor/overview`, `/contributor/my-prs`, `/contributor/earnings`, `/contributor/appeals`, `/contributor/profile`, `/contributor/settings`

**Maintainer:** `/maintainer/overview`, `/maintainer/batches`, `/maintainer/batches/new`, `/maintainer/projects`, `/maintainer/payouts`, `/maintainer/settings`

## Key Features

**15 PR Limit:** Live counter, blocked at 16

**Rubric Locking:** Permanent lock on creation with warning

**Gates System:** 5 gates per PR, disqualified PRs marked

**Judging Panel:** Animated 5-validator consensus

**Payout Modes:** Winner takes all OR Top 3 split (50/30/20)

**Transaction Lifecycle:** Reusable for all blockchain actions

## Tech Stack

Next.js 16, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Zustand, Recharts, next-themes, sonner

## Status

✅ Foundation complete (40%): Types, services, mock data, session store, landing, sign-in

🚧 In progress (60%): Route groups, sidebars, contributor/maintainer pages

See `REFACTOR_COMPLETION_GUIDE.md` for implementation plan.

## License

MIT
