# Gentask

**Get your open-source pull requests reviewed fairly — and get paid for the best work.**

Gentask lets a maintainer bundle up to 15 existing GitHub pull requests into a paid **review batch** with an escrowed stablecoin reward and a locked rubric. Objective gates filter the PRs, then [GenLayer](https://genlayer.com)'s validator network — independent nodes each running their own LLM — ranks the survivors against the rubric by consensus. No single person, server, or model decides the winner.

## How a batch works

1. **Select** — maintainer adds up to 15 open PRs; each is pinned to its head commit SHA.
2. **Lock** — the PR list and rubric become immutable on-chain.
3. **Gates** — validators check 6 objective facts from the GitHub API under strict consensus: CI green, tests present, diff ≤ 1000 lines, not a draft, targets the default branch, unchanged since selection.
4. **Judge** — validators independently read the real diffs, score every qualified PR 0–100 against the locked rubric, and must agree on the winner (`gl.eq_principle.prompt_comparative`).
5. **Payout plan** — the contract computes winner-takes-all or a 50/30/20 top-3 split (settlement via bridge is a later phase).

Prompt-injection is defended at both ends: diffs are wrapped in untrusted-data markers in the judging prompt, and the contract strictly validates the LLM's ranking (every qualified PR exactly once, scores 0–100) and reverts otherwise.

## Repository layout

| Path | What it is |
|---|---|
| `contracts/ReviewBatch.py` | The GenLayer intelligent contract — one deployed instance per batch |
| `contracts/tests/` | 33 pytest tests that run the real contract against a fake `genlayer` module and fake GitHub |
| `frontend/` | Next.js 16 app (TypeScript strict, Tailwind v4) with a `genlayer-js` connection layer |

## Deployment

**Live deployment (GenLayer studionet):** [`0x2f16499eD158BDb053A34ADe7dA5208c113d6e9c`](https://studio.genlayer.com)

This instance was deployed and driven through the **entire lifecycle** on-chain: `add_pr` (fetched the PR's real head SHA from GitHub under validator consensus) → `lock` → `run_gates` (read live CI/test/diff data and correctly disqualified a PR that failed the gates) → `judge`. Read its current state with:

```bash
genlayer network set studionet
genlayer call 0x2f16499eD158BDb053A34ADe7dA5208c113d6e9c get_batch_info
genlayer call 0x2f16499eD158BDb053A34ADe7dA5208c113d6e9c get_prs
```

> A **Bradbury testnet** address will be added once GenLayer's public testnet deploy endpoint is available (at time of writing, `rpc-bradbury.genlayer.com` is not processing contract deployments).

Deploy your own instance:

```bash
npm install -g genlayer
genlayer deploy --contract contracts/ReviewBatch.py \
  --args "owner/repo" "bug-fix" "Root cause identified\nTests added" 1000000000 "winner-takes-all"
```

Constructor args: `repo`, `rubric_template` (`bug-fix|feature|docs|design`), `rubric_criteria` (newline-separated), `reward_pool` (base units), `payout_mode` (`winner-takes-all|top-3-split`).

## Quick start

```bash
# Contract tests (no GenLayer install needed)
cd contracts && pip install pytest && python3 -m pytest tests/ -v

# Frontend
cd frontend && pnpm install && pnpm dev   # http://localhost:3000
# To talk to a deployed contract: cp .env.local.example .env.local and set
# NEXT_PUBLIC_GENLAYER_NETWORK + NEXT_PUBLIC_REVIEWBATCH_ADDRESS
```

### Drive the contract from the UI (for reviewers)

No wallet setup needed — the app uses a persistent in-browser GenLayer burner account on studionet.

1. **`/batches/create`** — deploy a fresh batch (repo + rubric + reward). You become its maintainer.
2. On the batch page, paste GitHub **PR URLs** → **Lock** → **Run gates** on each PR → **Judge**.
3. Watch the gates read live GitHub data and the validators rank the qualified PRs, then see the on-chain payout plan.

Or open **`/batches`** and hit "Try the live contract" to read the already-deployed batch end-to-end.

## Status & roadmap

**Working now:**

- **Contract** — full lifecycle (`add_pr` → `lock` → `run_gates` → `judge` → `get_payout_plan`), 33 passing tests, **deployed and driven end-to-end on GenLayer studionet** (address above).
- **GenLayer connection layer** (`frontend/lib/genlayer/`, `frontend/lib/services/review-batch-contract.ts`) — typed wrapper over every contract method, including `deploy()`, on a persistent burner account.
- **Functional wallet** — Connect Wallet uses **MetaMask** (via the GenLayer Snap) when available, and falls back to a persistent in-browser **burner account** otherwise, so reviewers need zero setup. Reads live on-chain GEN balance, with copy-address and disconnect.
- **Frontend shell** — landing, explore, and sign-in pages on the mock service layer; unbuilt routes render a branded "coming soon" page instead of a raw 404.

**Next:** a `BatchRegistry` factory contract so batches are discoverable on-chain (the UI currently tracks deployed addresses in localStorage) → Bradbury testnet deployment (blocked only by GenLayer's public testnet deploy endpoint). Later: GenLayer built-in appeals, bridged escrow payouts, sponsor campaigns.

## License

MIT
