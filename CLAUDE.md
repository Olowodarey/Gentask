# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Gentask is

A paid open-source code-review platform on **GenLayer** (a blockchain whose validators run LLMs and fetch web data under consensus). A maintainer bundles up to 15 existing GitHub PRs into a "review batch" with a stablecoin reward and a locked rubric. Each PR is pinned to its head commit SHA, filtered by 6 objective gates (CI green, tests present, diff ≤ 1000 lines, not draft, targets default branch, unchanged since selection), then GenLayer's validator network ranks the survivors against the rubric by LLM consensus and the contract computes the payout plan.

**v1 scope is review batches only.** Campaigns, grants, the task/bounty system, leaderboards, appeals, and real escrow/payouts are deliberately out of scope — the frontend's older docs and `lib/types` describe them, but the contract is the source of truth. When frontend docs (`frontend/*.md`) and the contract disagree, follow the contract.

## Layout

- `contracts/` — `ReviewBatch.py`, the GenLayer intelligent contract (one deployed instance = one batch). The real core of the project.
- `frontend/` — Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/Radix, Zustand. Partially built; runs on mock data with a GenLayer connection layer ready.
- `my-nest-project/` — untouched NestJS scaffold. **Parked; do not build here** until GitHub OAuth/webhooks are actually needed.

## Commands

```bash
# Contract tests (33 tests, no GenLayer install needed — see harness note below)
cd contracts && python3 -m pytest tests/ -q
python3 -m pytest tests/ -q -k "test_name"        # single test

# Frontend (uses pnpm)
cd frontend
pnpm dev                  # http://localhost:3000
pnpm build                # production build, also the TypeScript gate
npx tsc --noEmit          # faster typecheck only
pnpm lint

# GenLayer deployment (CLI: npm install -g genlayer)
genlayer init && genlayer up          # local Studio (Docker) — or use studio.genlayer.com
genlayer deploy --contract contracts/ReviewBatch.py \
  --args "owner/repo" "bug-fix" "criterion one\ncriterion two" 1000000000 "winner-takes-all"
# constructor args: repo, rubric_template (bug-fix|feature|docs|design),
#                   rubric_criteria (newline-separated), reward_pool (base units), payout_mode
```

## Contract architecture (`contracts/ReviewBatch.py`)

Lifecycle: `__init__` (draft) → `add_pr(url)` ×N → `lock()` (open, immutable) → `run_gates(i)` per PR → `judge()` (judged | no-winner) → `get_payout_plan()`.

Key mechanics to preserve when editing:

- **Determinism boundaries.** All GitHub API reads go through `gl.nondet.web.render` inside `gl.eq_principle.strict_eq` closures — validators must see byte-identical JSON. LLM ranking uses `gl.eq_principle.prompt_comparative` with the agreement rule "same first-place PR, broadly similar order". Nondeterministic calls only work inside those closures.
- **SDK constraints (deploy blockers if violated):** the `# { "Depends": "py-genlayer:<pinned-hash>" }` header must stay pinned (networks reject `latest`); errors are raised via `UserError = gl.vm.UserError` (there is no top-level `genlayer.UserError`); storage uses `TreeMap`/`u256`/`Address` and `@allow_storage` dataclasses, declared as class-level annotations only.
- **Prompt-injection defense.** PR diffs are wrapped in `<<<PR n>>>` markers and declared untrusted in the judging prompt; `_parse_ranking` strictly validates the LLM output (every qualified PR exactly once, scores 0–100) and reverts otherwise, leaving the batch open for retry. Tests cover both — keep them passing.
- **No money moves.** `get_payout_plan()` computes amounts (winner-takes-all or 50/30/20 split, rounding remainder to rank 1) but transfers are bridge-phase work. The UI must present plans as plans, not fake "Paid" states.
- **Known fragility:** unauthenticated GitHub API + `strict_eq` can fail consensus on rate limits (60 req/hr/IP) or data changing mid-call. Acceptable for Studio/testnet demos; keep demo batches small.

### Test harness coupling

`contracts/tests/test_review_batch.py` installs a **fake `genlayer` module** into `sys.modules` before importing the real contract (fake `gl` namespace, `TreeMap=dict`, `u256=int`, fake GitHub answering `web.render`). Any change to which SDK symbols the contract touches (e.g. `gl.vm.UserError`, `gl.eq_principle.*`) must be mirrored in the fake, or all tests break at import. The harness tests contract logic only — real consensus/storage behavior must be verified in Studio.

## Frontend architecture

**Service-layer rule (the core invariant):** components never import `lib/mock/*` directly — all data flows through `lib/services/*`. This exists so mock implementations can be swapped for GenLayer-backed ones without touching components. Preserve it.

The GenLayer connection layer is already wired:

- `lib/genlayer/client.ts` — `genlayer-js` client; network from `NEXT_PUBLIC_GENLAYER_NETWORK` (`localnet|studionet|testnet-asimov|testnet-bradbury`), persistent burner account in localStorage (to be replaced by MetaMask connect via `client.connect()`).
- `lib/services/review-batch-contract.ts` — typed wrapper for every contract method, incl. `deploy()` which creates a new batch contract (this is what the create-batch wizard should call). Writes wait for `ACCEPTED` receipts.
- `.env.local.example` — copy to `.env.local`, set network + `NEXT_PUBLIC_REVIEWBATCH_ADDRESS`.

State: `lib/store/session-store.ts` (persisted role switching contributor/maintainer, demo personas in `lib/mock/personas.ts`), `lib/store/wallet-store.ts`. Route guard `hooks/use-role-guard.ts` redirects to `/sign-in` or `/maintainer/setup` (the latter page doesn't exist yet).

Existing routes: `/`, `/explore`, `/sign-in`, `/(contributor)/contributor/overview`. Everything else in the older planning docs is unbuilt.

**One contract per batch means no on-chain batch index.** Until a small `BatchRegistry` factory contract exists, track deployed batch addresses client-side (localStorage/Zustand) so Explore can list them.

## Roadmap (agreed direction)

Milestone 0 — **GenLayer Foundation portal submission** (portal.genlayer.foundation/submit-contribution; stewards verify evidence, a public GitHub repo is required):
1. `git init` this project and push to a public GitHub repo (note: not currently a git repo).
2. Deploy `ReviewBatch.py` to Studio, run the full flow on a real repo with real PRs — this validates the riskiest assumption (LLM consensus quality on real diffs) and produces the deployed-contract evidence.
3. README with the deployed address + a short demo recording.

Then, in order: batch-detail page on live contract reads → create-batch wizard ending in `reviewBatchContract.deploy()` → `BatchRegistry` contract + Explore on it → MetaMask connect replacing the burner account → testnet Bradbury deployment. Later: GenLayer built-in appeals, bridge payouts, campaigns/grants on top of the registry, backend for GitHub OAuth/webhooks.
