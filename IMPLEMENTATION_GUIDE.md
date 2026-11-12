# Gentask Implementation Guide

This document provides instructions for completing the Gentask frontend implementation.

## Current Status

✅ Completed:
- Package dependencies added
- TypeScript types defined (`lib/types/index.ts`)
- Mock data created (60 PRs, 12 batches, 10 contributors, 3 campaigns, 4 grants)
- Service layer implemented (all 6 services)
- Utility functions (format, animation, cn)
- Constants and chains config
- Zustand wallet store
- Custom hooks (useWallet, useBatches, useMounted)
- Global CSS with dark theme
- Root layout with providers
- Header component with navigation

## Remaining Files to Create

### 1. UI Components (`components/ui/`)

Copy these from shadcn/ui or create manually:

```bash
# Essential UI components needed:
- input.tsx
- label.tsx
- select.tsx
- checkbox.tsx
- radio-group.tsx
- textarea.tsx
- dialog.tsx
- dropdown-menu.tsx
- popover.tsx
- tabs.tsx
- progress.tsx
- separator.tsx
- slider.tsx
- switch.tsx
- tooltip.tsx
- avatar.tsx
- skeleton.tsx
```

Quick install with shadcn CLI (if available):
```bash
npx shadcn@latest add button card badge input label select checkbox radio-group textarea dialog dropdown-menu popover tabs progress separator slider switch tooltip avatar skeleton
```

### 2. Layout Components

**components/layout/footer.tsx**
- Links to docs, GitHub, Twitter, Discord
- Copyright notice
- Company/project info

**components/layout/sidebar.tsx** (optional for dashboard)
- Navigation links
- User info section

### 3. Shared Components

**components/shared/wallet-button.tsx**
```tsx
"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/utils/format";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { connected, address, connect, disconnect, isConnecting } = useWallet();

  if (connected && address) {
    return (
      <Button variant="outline" onClick={disconnect}>
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting}>
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
```

**components/shared/animated-counter.tsx**
- Use framer-motion to animate number changes
- Props: value, duration, format function

**components/shared/chain-badge.tsx**
- Display chain logo and name
- Color-coded by chain

**components/shared/status-badge.tsx**
- Batch status with color coding
- Icons for each state

### 4. Landing Page Components

**components/landing/hero.tsx**
- Large heading: "AI-Validated Code Review Competitions"
- Subheading about earning rewards
- CTA buttons: "Explore Batches" and "Create Batch"
- Animated background gradient

**components/landing/how-it-works.tsx**
- 4 steps with icons and descriptions:
  1. Select PRs (up to 15)
  2. Set reward & rubric
  3. AI validators judge
  4. Winner gets paid
- Staggered animation on scroll

**components/landing/live-stats.tsx**
- 4 animated counters:
  - Total batches created
  - Total rewards paid
  - Active contributors
  - Avg review time
- Use animated-counter component

**components/landing/featured-batches.tsx**
- Grid of 3-4 active batches
- Card preview with project, reward, deadline
- Link to batch detail

### 5. Batch Components

**components/batch/batch-card.tsx**
- Project name, logo
- Reward amount, chain badge
- Deadline countdown
- Status badge
- PR count, maintainer
- Hover animation
- Click navigates to detail

**components/batch/batch-filters.tsx**
- Dropdowns: status, chain, work type, language
- Sliders: reward range
- Search input
- Clear filters button

**components/batch/rubric-display.tsx**
- Show rubric type and criteria
- Lock icon if locked
- Warning message about immutability

**components/batch/pr-list.tsx**
- Table/list of PRs
- Columns: number, title, author, files changed, CI status, SHA (locked), gates
- Expandable rows for gate details
- Disqualified PRs grayed out with reason

**components/batch/judging-panel.tsx**
- Different views by status:
  - Open: "Waiting for gates to complete"
  - Gates running: Progress indicator
  - Judging: Animated validator consensus (5 nodes)
  - Result: Winner announced, full ranking table
  - Paid: Success message with tx hash
  - Disputed: Appeal info

Validator animation:
- 5 circles arranged in panel
- Each "reads" evidence (pulse animation)
- Agreement animation (lines connecting)
- Reveal winner with confetti

### 6. Transaction Component

**components/transaction/transaction-lifecycle.tsx**
- Props: state, onRetry, txHash
- States: idle, confirm, pending, success, failed
- Animations for each state
- "View on Explorer" button when tx hash available
- Retry button on failure

### 7. Contributor Components

**components/contributor/pr-status-card.tsx**
- PR info with batch context
- Current rank and reason from validators
- Status: under review, judged, paid
- Link wallet button if needed
- Appeal button if eligible

**components/contributor/appeal-dialog.tsx**
- Dialog with appeal form
- Textarea for reason
- Character limit (500)
- Submit with confirmation

### 8. Pages

**app/page.tsx (Landing)**
```tsx
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiveStats } from "@/components/landing/live-stats";
import { FeaturedBatches } from "@/components/landing/featured-batches";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <LiveStats />
      <FeaturedBatches />
    </>
  );
}
```

**app/explore/page.tsx**
- Import useBatches hook
- BatchFilters component at top
- Grid/List toggle
- Map batches to BatchCard
- Pagination
- Loading skeletons
- Empty state: "No batches found"

**app/batches/[id]/page.tsx**
- Fetch batch by ID from service
- Display batch header: project, reward, deadline
- RubricDisplay component (locked)
- PRList component with gates
- JudgingPanel component
- Transaction status if applicable

**app/batches/create/page.tsx**
- 5-step form with progress bar:
  1. Select project (mock dropdown)
  2. Select PRs (max 15, live counter)
  3. Set rubric & payout mode
  4. Set reward, chain, deadline
  5. Review & confirm (rubric lock warning)
- Use React Hook Form + Zod
- Transaction lifecycle on submit

**app/dashboard/page.tsx**
- Require wallet connection
- My batches list
- PR slots used indicator
- Funds in escrow
- Pending actions (approve payouts, etc.)

**app/contributor/page.tsx**
- List contributor's PRs under review
- PRStatusCard for each
- Filter by status
- Empty state: "No PRs under review"

**app/leaderboard/page.tsx**
- Table of contributors
- Columns: rank, username, wins, earnings, reputation
- Click row to view profile
- Profile shows: bio, stats, earnings chart (Recharts), recent PRs

**app/campaigns/page.tsx**
- List campaigns with filters
- Card showing: sponsor, budget, spent, themes, dates
- Click to view campaign detail

**app/campaigns/[id]/page.tsx**
- Campaign header
- Eligible projects
- Stats charts: batches created, PRs reviewed, payouts
- Active contributors list
- "Join Campaign" button (if maintainer)

**app/grants/page.tsx**
- List grants with status filter
- Show: project, goal, budget, status, progress
- "Apply for Grant" button

**app/grants/[id]/page.tsx**
- Grant header
- Milestone timeline with statuses
- Evidence links for completed milestones
- Progress bar

**app/settings/page.tsx**
- Form with sections:
  - Connected wallet (change button)
  - Default chain selector
  - Notification toggles (each type)
- Save button (mock save)

### 9. Additional Files

**components/ui/toast.tsx** (for sonner)
- Already handled by Toaster in layout

**components/ui/form.tsx** (for React Hook Form)
- Create form context components
- Or use manually with RHF

### 10. Error and Loading States

Create in each page directory:
- `loading.tsx` - Loading skeleton
- `error.tsx` - Error boundary

Example **app/explore/loading.tsx**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <Skeleton className="h-12 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
```

## Quick Implementation Strategy

1. **Install shadcn components** (20 minutes)
   ```bash
   npx shadcn@latest add button card badge input label select checkbox radio-group textarea dialog dropdown-menu popover tabs progress separator slider switch tooltip avatar skeleton
   ```

2. **Create shared components** (30 minutes)
   - wallet-button, animated-counter, chain-badge, status-badge

3. **Create landing page** (45 minutes)
   - hero, how-it-works, live-stats, featured-batches

4. **Create batch components** (1 hour)
   - batch-card, batch-filters, rubric-display, pr-list, judging-panel

5. **Create pages** (2 hours)
   - landing, explore, batch detail, create batch, dashboard

6. **Create remaining pages** (1 hour)
   - contributor, leaderboard, campaigns, grants, settings

7. **Polish and test** (30 minutes)
   - Responsive design checks
   - Animation timing
   - Error states
   - Loading states

## Testing Checklist

- [ ] All pages load without errors
- [ ] Wallet connect/disconnect works
- [ ] Filters work on explore page
- [ ] PR selection enforces 15 limit
- [ ] Batch creation flow completes
- [ ] Judging panel animations work
- [ ] Responsive on mobile (375px)
- [ ] Dark theme applies correctly
- [ ] No TypeScript errors (`pnpm build`)
- [ ] No console errors in browser

## Design Tokens Reference

```css
/* Already defined in globals.css */
Primary color: oklch(65% 0.25 250) /* Electric blue */
Background: oklch(12% 0.01 270) /* Very dark */
Foreground: oklch(98% 0.01 270) /* Almost white */
Border: oklch(28% 0.01 270) /* Subtle */
```

## Animation Presets

```tsx
// Already in lib/utils/animation.ts
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/utils/animation";

// Usage:
<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>
```

## Common Patterns

**Fetch data in page:**
```tsx
"use client";
import { useState, useEffect } from "react";
import { batchService } from "@/lib/services/batch-service";

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    batchService.getBatch("batch1").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  return <div>{/* render data */}</div>;
}
```

**Form with validation:**
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  reward: z.number().min(100),
});

function Form() {
  const form = useForm({ resolver: zodResolver(schema) });
  // ... rest of form
}
```

## Next Steps

1. Run `pnpm install` to install all dependencies
2. Follow the Quick Implementation Strategy above
3. Test each component as you build
4. Refer to mock data in `/lib/mock/*` for realistic content
5. Use service layer exclusively - never import mock data directly in components

## Getting Help

- Shadcn docs: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion/
- Recharts: https://recharts.org
- Radix UI: https://www.radix-ui.com

The architecture is complete. All services, types, and data are ready. You just need to build the UI components and wire them together!
