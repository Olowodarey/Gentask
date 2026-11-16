# Gentask Frontend

A paid open-source review platform built with Next.js, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── explore/           # Browse review batches
│   ├── batches/           # Batch detail and creation
│   ├── dashboard/         # Maintainer dashboard
│   ├── contributor/       # Contributor view
│   ├── leaderboard/       # Rankings and profiles
│   ├── campaigns/         # Sponsor campaigns
│   ├── grants/            # Grant applications
│   └── settings/          # User settings
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── layout/            # Header, footer, nav
│   ├── landing/           # Landing page sections
│   ├── batch/             # Batch-related components
│   ├── transaction/       # Transaction lifecycle
│   ├── contributor/       # Contributor components
│   └── shared/            # Reusable components
├── lib/
│   ├── mock/              # Dummy data (60 PRs, 12 batches, 10 contributors, 3 campaigns, 4 grants)
│   ├── services/          # Service layer (replace with GenLayer later)
│   ├── types/             # TypeScript types
│   ├── store/             # Zustand state management
│   ├── utils/             # Utility functions
│   └── constants/         # Constants and config
└── hooks/                 # Custom React hooks
```

## Key Features

### Review Batch Flow
1. Maintainer connects GitHub project (mock)
2. Select up to 15 existing PRs (live counter: "7 / 15 selected")
3. Set reward, chain, rubric (locks on creation with warning)
4. Each PR pinned to head commit SHA (immutable)
5. Hard gates run: CI green, tests present, diff size, not draft, default branch
6. AI validators judge qualified PRs
7. Winner(s) paid from escrowed reward pool

### Payout Modes
- Winner takes all (default)
- Top 3 split (50/30/20)

### Batch States
- Open → Gates Running → Judging → Result in Transit → Paid | Disputed

### Service Layer
All data access goes through `/lib/services/*`:
- `batchService` - Create, get, list batches
- `prService` - List PRs, run gates
- `judgingService` - Start judging, get results, appeal
- `campaignService` - List, get, join campaigns
- `grantService` - Apply, list grants
- `walletService` - Connect, disconnect, link wallet

**To replace with real GenLayer:** Swap service implementations, keep interfaces identical.

## Data Rules

- All data is typed and comes from `/lib/mock/*`
- Components NEVER import mock data directly
- All async with artificial delays
- 60 PRs across 8 projects, various languages and states
- 12 review batches in different stages
- 10 contributors with histories
- 3 active campaigns
- 4 grants (different milestone states)

## Design System

### Colors (Dark First)
- Background: `oklch(12% 0.01 270)`
- Foreground: `oklch(98% 0.01 270)`
- Primary (accent): `oklch(65% 0.25 250)` - electric blue
- High contrast borders and subtle glows

### Typography
- Geist font family (Next.js default)
- Generous spacing
- Clear hierarchy

### Animation
- Page transitions
- Staggered list entrances
- Animated counters for stats
- Hover/press micro-interactions
- Skeleton loaders (no spinners)
- Validator consensus animation
- Celebration on payout complete
- Respects `prefers-reduced-motion`

### Responsive Breakpoints
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Theme:** next-themes
- **Toasts:** sonner
- **Font:** Geist (next/font)

## Key Pages

1. **Landing** (`/`) - Hero, how it works, stats, featured batches, FAQ
2. **Explore** (`/explore`) - Browse batches with filters and search
3. **Batch Detail** (`/batches/[id]`) - View batch, PRs, judging panel
4. **Create Batch** (`/batches/create`) - 5-step form with progress bar
5. **Dashboard** (`/dashboard`) - Maintainer view with active batches
6. **Contributor** (`/contributor`) - My PRs, ranks, appeals
7. **Leaderboard** (`/leaderboard`) - Rankings and earnings
8. **Campaigns** (`/campaigns`, `/campaigns/[id]`) - Sponsor-funded pools
9. **Grants** (`/grants`, `/grants/[id]`) - Milestone-based funding
10. **Settings** (`/settings`) - Wallet, chain, notifications

## Accessibility

- Semantic HTML throughout
- Keyboard navigation
- Focus rings on all interactive elements
- ARIA labels where needed
- Sufficient color contrast (WCAG AA)
- Screen reader friendly

## Mock Wallet

- Fake address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8`
- Mock balance: 1250.50 USDC
- No real wallet library yet
- Connect/disconnect simulation only

## Development Notes

### Gates System
Each PR must pass 5 gates:
1. CI checks passed
2. Tests present
3. Diff size < 1000 lines
4. Not a draft
5. Targets default branch

PRs that fail are marked "Disqualified" with reason shown.

### Judging Panel
Animated 5-validator consensus:
1. Validators read evidence
2. Reach agreement on winner
3. Reveal full ranking with reasons per PR

### Transaction States
Reusable component for any blockchain action:
- Idle → Confirm → Pending → Success/Failed
- With retry capability

### PR Selection Limit
Hard cap at 15 PRs per batch:
- Live counter shows "X / 15 selected"
- 16th selection blocked with clear message
- Warning before confirming batch creation

### Rubric Locking
Rubric locks permanently on batch creation:
- Clear warning shown in confirmation step
- Lock icon displayed on every rubric view
- Cannot be modified after creation

## Assumptions Made

- GitHub project connection is mocked (no OAuth)
- All blockchain transactions are simulated
- Validator consensus is animated but predetermined
- No real-time WebSocket yet (could be added)
- Appeal process queues for review (no immediate action)
- Campaign eligibility checked client-side only
- Grant milestones auto-advance for demo purposes

## Next Steps (Backend Integration)

When ready to connect to GenLayer:

1. Replace service functions in `/lib/services/*`
2. Keep interfaces identical
3. Add real wallet connection (RainbowKit, wagmi, etc.)
4. Implement actual transaction signing
5. Connect to GenLayer RPC
6. Deploy intelligent contracts for judging
7. Integrate real GitHub OAuth
8. Add webhook listeners for PR updates

All frontend code is already structured for this transition.

## Troubleshooting

**Dark mode not working?**
- Check `next-themes` provider in `app/layout.tsx`
- Ensure Tailwind config includes dark mode classes

**Animations too slow?**
- Check if `prefers-reduced-motion` is enabled
- Adjust animation duration in `/lib/utils/animation.ts`

**Type errors?**
- Run `pnpm build` to check for issues
- Ensure all types in `/lib/types/index.ts` are imported correctly

**Service layer not responding?**
- Check artificial delays in service files (300-800ms)
- Verify mock data imports

## License

MIT (Open Source)
