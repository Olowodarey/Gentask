# Gentask Setup Instructions

## What's Been Created

✅ **Complete Backend Architecture:**
- Full type system (15+ types)
- 60 realistic pull requests
- 12 review batches in various states
- 10 contributors with histories
- 3 active campaigns
- 4 grants with milestones
- 6 service layers (ready to swap with GenLayer)
- Zustand store for wallet state
- Utility functions (formatting, animation)
- Constants and chain configs

✅ **Foundation UI:**
- Root layout with ThemeProvider
- Header with navigation and mobile menu
- Footer with links
- Global CSS with dark theme tokens
- Button and Card components
- Badge component
- Wallet button with connect/disconnect
- Animated counter component
- Landing page with all sections

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
cd /home/olowo/Desktop/my\ projects/Gentask/frontend
pnpm install

# 2. Run development server
pnpm dev

# 3. Open browser
# Navigate to http://localhost:3000
```

You should see the landing page with hero, stats, and featured batches!

## What Still Needs to Be Built

The architecture, data, and services are 100% complete. You need to build the UI components and pages. Here's the fastest path:

### Step 1: Install shadcn UI Components (10 minutes)

```bash
# Install the shadcn CLI components you need
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate  
# - CSS variables: Yes

# Then add all the components:
npx shadcn@latest add input label select checkbox radio-group textarea dialog dropdown-menu popover tabs progress separator slider switch tooltip avatar skeleton
```

This gives you all the form controls and UI primitives.

### Step 2: Create Essential Shared Components (20 minutes)

You need these 4 files in `components/shared/`:

1. **chain-badge.tsx** - Shows chain logo and name
2. **status-badge.tsx** - Colored badge for batch status
3. Both are simple - just Badge component with props

### Step 3: Create Batch Components (45 minutes)

In `components/batch/`:

1. **batch-card.tsx** - Card showing batch preview
   - Use Card, Badge, formatCurrency, formatTimeRemaining
   - Click navigates to `/batches/[id]`

2. **batch-filters.tsx** - Filter controls
   - Use Select, Slider, Input for search
   - Manage filter state, call parent onChange

3. **rubric-display.tsx** - Show rubric criteria
   - Map over criteria array
   - Show lock icon if locked

4. **pr-list.tsx** - Table of PRs
   - Show number, title, author, files, CI status, SHA
   - Gate results expandable

5. **judging-panel.tsx** - Animated validator visualization
   - Different views per batch status
   - Use framer-motion for animations

### Step 4: Build Pages (90 minutes)

1. **app/explore/page.tsx** - Browse batches
```tsx
"use client";
import { useState } from "react";
import { useBatches } from "@/hooks/use-batches";
import { BatchCard } from "@/components/batch/batch-card";
import { BatchFilters } from "@/components/batch/batch-filters";

export default function ExplorePage() {
  const [filters, setFilters] = useState({});
  const { batches, loading } = useBatches(filters);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Explore Review Batches</h1>
      <BatchFilters onChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {batches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>
    </div>
  );
}
```

2. **app/batches/[id]/page.tsx** - Batch detail
```tsx
"use client";
import { use, useEffect, useState } from "react";
import { batchService } from "@/lib/services/batch-service";
import { prService } from "@/lib/services/pr-service";

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [batch, setBatch] = useState(null);
  const [prs, setPRs] = useState([]);

  useEffect(() => {
    batchService.getBatch(id).then(setBatch);
    // fetch PRs...
  }, [id]);

  if (!batch) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      {/* Header with project, reward, deadline */}
      {/* Rubric display */}
      {/* PR list */}
      {/* Judging panel */}
    </div>
  );
}
```

3. **app/batches/create/page.tsx** - 5-step form
   - Use React Hook Form
   - Progress indicator
   - PR selection with counter
   - Rubric lock warning
   - Transaction lifecycle

4. **app/dashboard/page.tsx** - Maintainer dashboard
5. **app/contributor/page.tsx** - Contributor view
6. **app/leaderboard/page.tsx** - Rankings
7. **app/campaigns/page.tsx** + **app/campaigns/[id]/page.tsx**
8. **app/grants/page.tsx** + **app/grants/[id]/page.tsx**
9. **app/settings/page.tsx**

### Step 5: Polish (30 minutes)

- Add loading.tsx and error.tsx to each route
- Test responsive design
- Check animations
- Verify TypeScript builds

## File Checklist

Use this to track your progress:

### Core (Already Done ✅)
- [x] package.json
- [x] tsconfig.json
- [x] app/globals.css
- [x] app/layout.tsx
- [x] app/page.tsx
- [x] lib/types/index.ts
- [x] lib/constants/chains.ts
- [x] lib/utils/*.ts
- [x] lib/mock/*.ts (all 5 files)
- [x] lib/services/*.ts (all 6 files)
- [x] lib/store/wallet-store.ts
- [x] hooks/*.ts (all 3 files)
- [x] components/ui/button.tsx
- [x] components/ui/card.tsx
- [x] components/ui/badge.tsx
- [x] components/layout/header.tsx
- [x] components/layout/footer.tsx
- [x] components/shared/wallet-button.tsx
- [x] components/shared/animated-counter.tsx

### To Build (Prioritized)
- [ ] Run shadcn init and add components
- [ ] components/shared/chain-badge.tsx
- [ ] components/shared/status-badge.tsx
- [ ] components/batch/batch-card.tsx
- [ ] components/batch/batch-filters.tsx
- [ ] components/batch/rubric-display.tsx
- [ ] components/batch/pr-list.tsx
- [ ] components/batch/judging-panel.tsx
- [ ] app/explore/page.tsx
- [ ] app/batches/[id]/page.tsx
- [ ] app/batches/create/page.tsx
- [ ] app/dashboard/page.tsx
- [ ] app/contributor/page.tsx
- [ ] app/leaderboard/page.tsx
- [ ] app/campaigns/page.tsx
- [ ] app/campaigns/[id]/page.tsx
- [ ] app/grants/page.tsx
- [ ] app/grants/[id]/page.tsx
- [ ] app/settings/page.tsx
- [ ] components/transaction/transaction-lifecycle.tsx
- [ ] components/contributor/*.tsx

## Testing Your Build

```bash
# Check for TypeScript errors
pnpm build

# Should compile with 0 errors

# Run development server
pnpm dev

# Test these workflows:
# 1. Browse to http://localhost:3000 - see landing page
# 2. Click "Explore Batches" - see grid of batches
# 3. Click a batch - see batch detail
# 4. Click "Connect Wallet" - see mock connection
# 5. Navigate to Dashboard - see maintainer view
```

## Common Issues

**"Cannot find module shadcn"**
- Run `npx shadcn@latest init` first
- Follow prompts to set up

**"Module not found: @/components/ui/..."**
- Make sure you ran `npx shadcn@latest add [component]`
- Check that tsconfig.json has `"@/*": ["./*"]` in paths

**Dark theme not applying**
- Verify ThemeProvider is in layout.tsx
- Check globals.css has theme variables

**Animations not working**
- Run `pnpm install` to get framer-motion
- Check browser console for errors

**Service calls returning empty**
- Services have artificial delays (300-800ms)
- Check browser network tab
- Look for console errors

## Architecture Notes

### Why Service Layer?
All components call services, never import mock data directly. This means when you're ready to integrate GenLayer:

1. Keep all service interfaces identical
2. Replace implementations with real API calls
3. No component changes needed!

Example:
```tsx
// Before (mock):
export const batchService = {
  async listBatches() {
    await delay(300);
    return MOCK_BATCHES;
  }
};

// After (real GenLayer):
export const batchService = {
  async listBatches() {
    const response = await genLayerClient.query("listBatches");
    return response.batches;
  }
};

// Components stay identical! ✨
```

### Why Zustand?
Simple global state for wallet. Easy to add more stores later (notification store, filter store, etc.).

### Why This Structure?
- `/lib/mock` - Easy to delete when real data comes
- `/lib/services` - Clean abstraction layer
- `/lib/types` - Single source of truth
- `/components` - Organized by feature
- `/app` - Routes match URLs

## Next Steps After UI Complete

1. **Replace mock wallet** with RainbowKit + wagmi
2. **Connect to GenLayer RPC** in service layer
3. **Add GitHub OAuth** for real project connection
4. **Deploy intelligent contracts** for judging
5. **Set up webhooks** for PR updates
6. **Add real-time** updates with WebSocket

But UI first! Get it working with mock data, then swap the backend.

## Need Help?

Refer to:
- `GENTASK_README.md` - Full product documentation
- `IMPLEMENTATION_GUIDE.md` - Detailed component specs
- `/lib/mock/*.ts` - See data structure
- `/lib/types/index.ts` - Type definitions

The hardest parts are done. You have:
- ✅ Complete data model
- ✅ 100% typed
- ✅ Service layer ready
- ✅ Landing page working
- ✅ Layout and navigation
- ✅ Theme system

Now just build the remaining UI components and wire them up! You're 40% done.

Good luck! 🚀
