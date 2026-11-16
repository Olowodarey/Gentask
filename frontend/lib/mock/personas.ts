import { DemoPersona } from "@/lib/types";

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "tunde",
    name: "Tunde",
    role: "Contributor",
    description: "Active contributor with 5 PRs under review. Maintainer mode not set up yet.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tunde",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
    githubHandle: "tunde-codes",
    maintainerEnabled: false,
    connectedProjects: [],
  },
  {
    id: "ada",
    name: "Ada",
    role: "Maintainer",
    description: "Project maintainer with 3 active review batches. Can instantly switch roles.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ada",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    githubHandle: "ada-maintains",
    maintainerEnabled: true,
    connectedProjects: ["proj1", "proj4"],
  },
  {
    id: "zara",
    name: "Zara",
    role: "Both",
    description: "Power user - contributes to projects and maintains her own. Rich data in both roles.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zara",
    walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    githubHandle: "zara-builds",
    maintainerEnabled: true,
    connectedProjects: ["proj3", "proj6"],
  },
];

// Persona-specific data mappings
export const PERSONA_DATA = {
  tunde: {
    prs: ["pr10", "pr14", "pr20", "pr35", "pr42"], // Contributor PRs under review
    earnings: 12500,
    wins: 3,
    winRate: 0.6,
    reputation: 82,
    payouts: [
      {
        id: "payout1",
        batchId: "batch10",
        prId: "pr10",
        contributorId: "tunde",
        amount: 5000,
        stablecoin: "USDC",
        status: "claimable",
        walletLinked: true,
      },
    ],
    appeals: [],
  },
  ada: {
    batches: ["batch1", "batch4", "batch7"], // Maintainer's batches
    fundsInEscrow: 23500,
    prsSlotsUsed: 14, // out of 15
    prsAwaitingReview: 8,
    totalPaidOut: 87000,
  },
  zara: {
    // Contributor side
    prs: ["pr4", "pr16", "pr17"], // She's in batch3!
    earnings: 28900,
    wins: 7,
    winRate: 0.7,
    reputation: 94,
    payouts: [
      {
        id: "payout2",
        batchId: "batch3",
        prId: "pr17",
        contributorId: "zara",
        amount: 10000,
        stablecoin: "USDC",
        status: "in-transit",
        walletLinked: true,
      },
    ],
    appeals: [],
    // Maintainer side
    batches: ["batch3", "batch8"], // She maintains these
    fundsInEscrow: 15000,
    prsSlotsUsed: 8,
    prsAwaitingReview: 4,
    totalPaidOut: 42000,
  },
};
