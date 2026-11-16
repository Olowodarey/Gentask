# Gentask

**Get your open-source pull requests reviewed fairly, and get paid for the best work.**

Gentask is a platform where maintainers put up to 15 pull requests into a paid review, and a panel of independent AI validators on [GenLayer](https://genlayer.com) picks the best one against a public rubric. The winner is paid, and everyone can see why.

---

## What problem does it solve?

Paying for open-source work usually depends on one person deciding who gets rewarded. That can be slow, subjective, and hard to trust, for maintainers and contributors alike.

Gentask makes the decision process:

- **Fair:** the rules are fixed before anyone is judged.
- **Transparent:** every ranking comes with a short reason.
- **Neutral:** a panel of independent validators decides, not one person.
- **Contestable:** if you disagree, you can appeal.

## Who is it for?

| If you are a...             | Gentask gives you...                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Contributor**             | A clear rank, written reasons for the result, and a way to get paid and appeal.      |
| **Maintainer**              | A way to reward the best PR without reviewing and negotiating every payout yourself. |
| **Sponsor** _(coming soon)_ | A way to fund campaigns for the projects and themes you care about.                  |

Everyone signs in as a **contributor** first. Maintainers switch to **maintainer mode** from the profile menu whenever they need it. You can use both.

## How it works

### For maintainers

1. **Connect a project.** Link your GitHub project and see its open pull requests.
2. **Pick up to 15 PRs.** Choose the PRs you want reviewed. These are the only ones in the batch.
3. **Set the rules.** Choose a rubric (bug fix, feature, docs, or design), the reward, the chain, and the deadline. The rubric **locks** once the batch is created.
4. **Let the validators judge.** Gentask checks the basics, then the validators compare the remaining PRs.
5. **Pay the winner.** The reward goes to the winning PR, or is split among the top 3 if you chose that mode.

### For contributors

1. **Sign in.** Connect your wallet and GitHub.
2. **Get selected.** If a maintainer picks one of your PRs for a batch, you'll be notified.
3. **Track your PRs.** See all your PRs under review in the contributor dashboard, with:
   - Batch status (Open, Judging, Paid, etc.)
   - Your current rank (if judging is complete)
   - Validator feedback explaining the ranking
   - Pinned commit SHA (locked at selection time)
   - Merge status (whether the PR was merged into the project)
   - Time remaining until batch deadline
4. **See your result.** View your rank and the validators' reasons for it.
5. **Get paid.** Link your wallet and claim your reward if you win.
6. **Appeal if needed.** If you think the result is wrong, you can contest it.

## How a decision is made

```
Maintainer selects up to 15 PRs
            |
   Each PR is locked to its exact commit
            |
   Basic checks (CI passing, tests, size)
            |
   Validators compare the remaining PRs
            |
   Ranking + reasons are published
            |
   Winner is paid  (appeals available)
```

**Basic checks.** A PR is removed if it fails any of these: CI not passing, no tests where the rubric needs them, an oversized change, a draft PR, or not targeting the main branch.

**Locked commits.** Each selected PR is pinned to its exact commit when the batch is created, so code cannot be changed after selection.

**Locked rules.** The rubric cannot be edited once the batch is created, so the maintainer cannot change the rules to favor someone.

**Independent validators.** Several independent AI validators on GenLayer review the evidence and must reach agreement on the result.

## Work types

| Type            | What is judged                                                                            |
| --------------- | ----------------------------------------------------------------------------------------- |
| Bug fix         | Does it fix the root cause with a small, focused change and a test?                       |
| Feature         | Does it meet the spec, with tests and documentation?                                      |
| Docs / refactor | Is it accurate, clear, and does the project still build?                                  |
| Design / UI     | Does it meet the brief and render correctly? Larger rewards may need maintainer sign-off. |

## Campaigns and grants _(coming soon)_

- **Campaigns:** sponsors such as chains, foundations, and DAOs fund a pool for a theme. Maintainers join and batches draw from the pool.
- **Grants:** projects request funding in milestones, and each tranche is released when the delivered work meets the agreed criteria.

## Frequently asked questions

**Do contributors submit PRs on Gentask?**
No. Gentask works on PRs that already exist in the maintainer's project. The maintainer selects which ones to review. Contributors work on open-source projects normally, and may find their PRs selected for a paid review batch.

**How do I know if my PR was selected?**
Check your contributor dashboard at `/contributor/overview`. Any PR a maintainer selected will appear there with full batch details, status, and validator feedback (once judging is complete).

**Can I see if my PR was merged?**
Yes. The dashboard shows merge status alongside Gentask review status. A PR can be judged, ranked, and paid by Gentask even if it hasn't been merged yet (or vice versa).

**Why only 15 PRs?**
A small batch keeps judging fast, focused, and affordable.

**Can the maintainer pick a winner themselves?**
No. The maintainer chooses which PRs enter the batch and sets the rubric, but the validators pick the winner.

**What if I think the result is wrong?**
You can file an appeal.

**Is the AI always right?**
No. AI judgment can make mistakes, which is why Gentask uses objective checks first, a locked rubric, several independent validators, and appeals.

**Where is the money held?**
During the demo, nowhere, because it uses dummy data. In the real version, rewards will be held in escrow on the chain the maintainer picks, and paid out when the result is final.

## Contributor Dashboard

The contributor dashboard (`/contributor/overview`) shows:

- **Stats at a glance:** PRs under review, total earned, wins, win rate, and reputation score
- **PRs Under Review:** All your PRs that maintainers selected for batches, with:
  - Project name and PR number
  - Batch status with color-coded badges
  - Current rank (once judging is complete)
  - Validator feedback explaining your ranking
  - Pinned commit SHA (locked at selection)
  - Merge status indicator
  - Reward amount and payout mode
  - Time remaining until deadline
- **Claimable Payouts:** Rewards ready to claim with one-click access
- **Quick Actions:** Links to explore batches, view leaderboard, and edit profile

### What you can see about your PRs

Each PR card shows:

- **Status badge:** Open, Judging, Paid, Disputed
- **Rank badge:** Your position if judging is done (e.g., "Rank #2")
- **Gate results:** Green checkmark if all gates passed, alert icon if disqualified
- **Pinned commit:** The exact SHA your PR was judged on (with lock icon)
- **Merge status:** Whether your PR was merged into the project (tracked separately from Gentask judging)
- **Validator feedback:** Short reason explaining your rank
- **Reward info:** Total pool, payout mode (winner-takes-all or top-3-split), number of competing PRs

## Try the demo

The current version is a frontend demo with dummy data. You can explore both the contributor and maintainer apps.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

**Demo personas** on the sign-in page let you explore in one click. Each starts in the contributor app:

- **Tunde:** a contributor with no maintainer setup.
- **Ada:** a contributor who has already set up maintainer mode.
- **Zara:** both roles, with rich data in each.

To see the maintainer app, open the profile menu and choose **Switch to Maintainer**.

## Roadmap

- [x] Frontend demo with dummy data
- [x] Contributor dashboard with PR tracking
- [x] Role-based navigation (contributor/maintainer apps)
- [x] Demo personas for quick exploration
- [ ] Review Batch smart contract on GenLayer
- [ ] Connect the frontend to the contract
- [ ] Stablecoin escrow and payouts on an EVM chain
- [ ] Real GitHub integration (OAuth, PR status sync)
- [ ] Campaigns and sponsor dashboard
- [ ] Grants with milestone payouts
- [ ] Contributor reputation and leaderboard

## Built with

- Next.js, TypeScript, Tailwind CSS, shadcn/ui, Motion
- GenLayer Intelligent Contracts for judging _(coming soon)_
- An EVM escrow contract for stablecoin payouts _(coming soon)_

## Contributing

Ideas and feedback are welcome. Open an issue to share a suggestion or report a problem. Code contributions will open once the first contract is in place.

## License

To be decided.
