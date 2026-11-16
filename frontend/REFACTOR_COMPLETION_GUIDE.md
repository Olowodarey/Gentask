# Gentask Refactor & Enhancement - Completion Guide

## Status: 40% Complete

### ✅ Completed (Files Changed/Created)

1. **Types Updated** - `lib/types/index.ts` - Added Session, UserRole, Appeal, Payout, DemoPersona
2. **Session Store** - `lib/store/session-store.ts` - New Zustand store with persist
3. **Mock Personas** - `lib/mock/personas.ts` - Tunde, Ada, Zara with data
4. **Auth Service** - `lib/services/auth-service.ts` - Sign-in, role switching
5. **Payout Service** - `lib/services/payout-service.ts` - Claim, link wallet
6. **Appeal Service** - `lib/services/appeal-service.ts` - File appeals, get status
7. **Custom Hooks** - `hooks/use-session.ts`, `hooks/use-role-guard.ts`
8. **Landing Page Updated** - `app/page.tsx` - Role toggle, benefits, updated CTAs
9. **Sign-In Page** - `app/sign-in/page.tsx` - Two-step + demo personas

### 🚧 Remaining Work (60%)

## Phase 1: Update Header for Role-Aware Navigation

**File:** `components/layout/header.tsx`

Add:
- Avatar menu with role switcher
- Conditional navigation based on activeRole
- "Go to Dashboard" link when signed in

```tsx
// Add to header.tsx:
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// In Header component:
const { isSignedIn, activeRole, githubHandle, maintainerEnabled, switchRole, disconnect } = useSession();

// Replace navigation array with:
const navigation = isSignedIn
  ? [
      { name: "Explore", href: "/explore" },
      { name: "Campaigns", href: "/campaigns" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Dashboard", href: `/${activeRole}/overview` },
    ]
  : [
      { name: "Explore", href: "/explore" },
      { name: "Campaigns", href: "/campaigns" },
      { name: "Leaderboard", href: "/leaderboard" },
    ];

// Add avatar menu after WalletButton:
{isSignedIn && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{githubHandle?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link href={`/${activeRole}/profile`}>Profile</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/${activeRole}/settings`}>Settings</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {maintainerEnabled && (
        <>
          <DropdownMenuItem onClick={() => switchRole(activeRole === "contributor" ? "maintainer" : "contributor")}>
            Switch to {activeRole === "contributor" ? "Maintainer" : "Contributor"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      {!maintainerEnabled && (
        <>
          <DropdownMenuItem asChild>
            <Link href="/maintainer/setup">Set up Maintainer</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem onClick={disconnect}>Sign Out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}
```

## Phase 2: Create Route Group Layouts

### File: `app/(public)/layout.tsx`

```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

Move existing `/explore` to `/(public)/explore`.

### File: `app/(contributor)/layout.tsx`

```tsx
import { ContributorSidebar } from "@/components/layout/contributor-sidebar";
import { useRoleGuard } from "@/hooks/use-role-guard";

export default function ContributorLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("contributor");
  
  return (
    <div className="flex min-h-screen">
      <ContributorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

### File: `app/(maintainer)/layout.tsx`

```tsx
import { MaintainerSidebar } from "@/components/layout/maintainer-sidebar";
import { useRoleGuard } from "@/hooks/use-role-guard";

export default function MaintainerLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("maintainer");
  
  return (
    <div className="flex min-h-screen" style={{ filter: "hue-rotate(15deg)" }}> {/* Slightly different tint */}
      <MaintainerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

## Phase 3: Create Sidebars

### File: `components/layout/contributor-sidebar.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, DollarSign, AlertCircle, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Overview", href: "/contributor/overview", icon: Home },
  { name: "My PRs", href: "/contributor/my-prs", icon: FileText },
  { name: "Earnings", href: "/contributor/earnings", icon: DollarSign },
  { name: "Appeals", href: "/contributor/appeals", icon: AlertCircle },
  { name: "Profile", href: "/contributor/profile", icon: User },
  { name: "Settings", href: "/contributor/settings", icon: Settings },
];

export function ContributorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            C
          </div>
          <span className="text-sm font-medium">Contributor</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### File: `components/layout/maintainer-sidebar.tsx`

```tsx
// Same structure as contributor, but with maintainer navigation:
const navigation = [
  { name: "Overview", href: "/maintainer/overview", icon: Home },
  { name: "Batches", href: "/maintainer/batches", icon: Layers },
  { name: "Projects", href: "/maintainer/projects", icon: FolderGit2 },
  { name: "Payouts", href: "/maintainer/payouts", icon: DollarSign },
  { name: "Settings", href: "/maintainer/settings", icon: Settings },
];

// Badge shows "Maintainer" with different color
```

## Phase 4: Contributor Pages

### `app/(contributor)/contributor/overview/page.tsx`

```tsx
"use client";

import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { authService } from "@/lib/services/auth-service";
import { TrendingUp, Award, Target, DollarSign } from "lucide-react";

export default function ContributorOverviewPage() {
  const { githubHandle } = useSession();
  const data = authService.getPersonaData("tunde"); // Get based on actual user

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {githubHandle}!</h1>
        <p className="text-muted-foreground">Here's your contributor overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="PRs Under Review" value={data?.prs.length || 0} />
        <StatCard icon={DollarSign} label="Total Earned" value={`$${data?.earnings || 0}`} />
        <StatCard icon={Award} label="Wins" value={data?.wins || 0} />
        <StatCard icon={Target} label="Win Rate" value={`${Math.round((data?.winRate || 0) * 100)}%`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PRs Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          {/* List of PRs with status, rank, etc. */}
        </CardContent>
      </Card>

      {/* Claimable payouts card */}
      {/* Appeals tracker */}
      {/* Activity feed */}
    </div>
  );
}
```

### `app/(contributor)/contributor/my-prs/page.tsx`

List of contributor's PRs with filters, status chips, ranks, validator feedback.

### `app/(contributor)/contributor/my-prs/[id]/page.tsx`

Detail view of single PR: batch context, gate results, rank, validators' reason, appeal button.

### `app/(contributor)/contributor/earnings/page.tsx`

Earnings chart (Recharts), breakdown by batch, total earned, pending payouts.

### `app/(contributor)/contributor/appeals/page.tsx`

List of appeals with status (not-filed, filed, under-review, resolved).

### `app/(contributor)/contributor/profile/page.tsx`

Public profile: bio, stats, badges, recent PRs.

### `app/(contributor)/contributor/settings/page.tsx`

Notification toggles, linked wallets, preferred chain.

## Phase 5: Maintainer Pages

### `app/(maintainer)/maintainer/overview/page.tsx`

```tsx
// Similar structure to contributor overview
// Stats: Active batches, Funds in escrow, PR slots used (X / 15), Total paid out
// Review Batches table with status chips
// Alerts panel
// Payout timeline
```

### `app/(maintainer)/maintainer/batches/page.tsx`

Table of batches with filters, status chips, quick actions.

### `app/(maintainer)/maintainer/batches/new/page.tsx`

5-step form:
1. Pick project (dropdown)
2. Select PRs (with `<PRSelector />` component, enforces 15 limit)
3. Set rubric & payout mode
4. Set reward, chain, deadline
5. Review & confirm (rubric lock warning)

### `app/(maintainer)/maintainer/batches/[id]/page.tsx`

Batch detail with maintainer controls: fund batch, start gates, start judging.

### `app/(maintainer)/maintainer/projects/page.tsx`

List of connected projects with open PR counts, connect new project button.

### `app/(maintainer)/maintainer/payouts/page.tsx`

Timeline of payouts with transaction status.

### `app/(maintainer)/maintainer/settings/page.tsx`

Same as contributor settings.

## Phase 6: Shared Components

### `components/shared/stat-card.tsx`

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "./animated-counter";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
}

export function StatCard({ icon: Icon, label, value, change }: StatCardProps) {
  const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  const isNumber = !isNaN(numValue);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary" />
          {change !== undefined && (
            <span className={cn("text-xs font-medium", change > 0 ? "text-green-500" : "text-red-500")}>
              {change > 0 ? "+" : ""}{change}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">
            {isNumber ? <AnimatedCounter value={numValue} /> : value}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### `components/shared/transaction-lifecycle.tsx`

```tsx
"use client";

import { TransactionState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface TransactionLifecycleProps {
  state: TransactionState;
  txHash?: string;
  onRetry?: () => void;
  onConfirm?: () => void;
}

export function TransactionLifecycle({ state, txHash, onRetry, onConfirm }: TransactionLifecycleProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {state === "idle" && (
        <Button onClick={onConfirm}>Confirm Transaction</Button>
      )}
      
      {state === "confirm" && (
        <>
          <div className="text-center">
            <p className="text-lg font-medium">Confirm in your wallet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please approve the transaction in your wallet
            </p>
          </div>
        </>
      )}
      
      {state === "pending" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium">Transaction Pending</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few moments...
            </p>
          </div>
        </>
      )}
      
      {state === "success" && (
        <>
          <CheckCircle className="h-12 w-12 text-green-500" />
          <div className="text-center">
            <p className="text-lg font-medium">Transaction Successful!</p>
            {txHash && (
              <Button variant="link" size="sm" className="mt-2">
                View on Explorer
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </>
      )}
      
      {state === "failed" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <p className="text-lg font-medium">Transaction Failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              Something went wrong. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">Retry</Button>
          )}
        </>
      )}
    </div>
  );
}
```

### `components/batch/judging-panel.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Shield, Award } from "lucide-react";
import { BatchStatus } from "@/lib/types";

interface JudgingPanelProps {
  status: BatchStatus;
  ranking?: Array<{ prId: string; rank: number; reason: string }>;
}

export function JudgingPanel({ status, ranking }: JudgingPanelProps) {
  if (status === "open") {
    return <div className="text-center p-8 text-muted-foreground">Waiting for batch to start...</div>;
  }

  if (status === "gates-running") {
    return <div className="text-center p-8">Running gate checks...</div>;
  }

  if (status === "judging") {
    return (
      <div className="p-8">
        <h3 className="text-lg font-medium text-center mb-8">AI Validators Judging</h3>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground mt-2">Validator {i}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Validators are analyzing PRs and reaching consensus...
        </p>
      </div>
    );
  }

  if (status === "paid" && ranking) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Judging Complete!</h3>
        </div>
        <div className="space-y-3">
          {ranking.map((r) => (
            <div key={r.prId} className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {r.rank}
              </div>
              <div className="flex-1">
                <div className="font-medium">PR #{r.prId}</div>
                <div className="text-sm text-muted-foreground mt-1">{r.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="text-center p-8">{status}</div>;
}
```

### `components/batch/pr-selector.tsx`

```tsx
"use client";

import { useState } from "react";
import { PullRequest } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PRSelectorProps {
  prs: PullRequest[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelection?: number;
}

export function PRSelector({ prs, selected, onChange, maxSelection = 15 }: PRSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredPRs = prs.filter(pr =>
    pr.title.toLowerCase().includes(search.toLowerCase()) ||
    pr.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (prId: string) => {
    if (selected.includes(prId)) {
      onChange(selected.filter(id => id !== prId));
    } else {
      if (selected.length >= maxSelection) {
        toast.error(`Maximum ${maxSelection} PRs allowed`);
        return;
      }
      onChange([...selected, prId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search PRs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm font-medium">
          Selected: {selected.length} / {maxSelection}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredPRs.map((pr) => (
          <div
            key={pr.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <Checkbox
              checked={selected.includes(pr.id)}
              onCheckedChange={() => handleToggle(pr.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">#{pr.number}</span>
                <span className="text-sm">{pr.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{pr.author}</span>
                <Badge variant={pr.ciStatus === "success" ? "default" : "destructive"} className="text-xs">
                  {pr.ciStatus}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {pr.filesChanged} files
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Phase 7: Install Missing shadcn Components

```bash
npx shadcn@latest add avatar dropdown-menu input checkbox tabs
```

## Phase 8: Update Package.json (if needed)

Add `zustand/middleware` for persist:

```json
"dependencies": {
  "zustand": "^5.1.0"
}
```

## Summary of Assumptions

1. **Persona data**: Tunde, Ada, Zara have distinct mock data seeded
2. **Role switching**: Animated layout transition handled by Next.js layout
3. **Maintainer setup**: First-time flow shows a simple dialog, subsequent switches are instant
4. **Permissions**: Enforced client-side (would be server-side in production)
5. **Transaction lifecycle**: Mock delays, no real blockchain calls
6. **Appeals**: File and track status, no resolution logic yet
7. **Charts**: Recharts for earnings visualization
8. **Mobile**: Drawer/sheet for sidebar on mobile (use shadcn Sheet component)

## Testing Checklist

- [ ] Landing page shows role toggle
- [ ] Sign-in works with demo personas
- [ ] Contributor dashboard shows correct stats
- [ ] Maintainer dashboard shows batch table
- [ ] Role switcher in avatar menu works
- [ ] 15 PR limit enforced in selector
- [ ] Judging panel animates validators
- [ ] Transaction lifecycle shows all states
- [ ] Appeals can be filed
- [ ] Payouts can be claimed
- [ ] Settings persist across sessions
- [ ] Responsive on mobile

## Timeline Estimate

- Phase 1 (Header): 1 hour
- Phase 2 (Route groups): 30 min
- Phase 3 (Sidebars): 1 hour
- Phase 4 (Contributor pages): 3 hours
- Phase 5 (Maintainer pages): 3 hours
- Phase 6 (Shared components): 2 hours
- Phase 7 (shadcn install): 15 min
- Phase 8 (Testing): 1 hour

**Total: ~12 hours**

All core architecture is in place. The remaining work is primarily UI assembly following established patterns.
