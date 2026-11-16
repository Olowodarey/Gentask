export type Chain = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  testnet?: boolean;
};

export type PayoutMode = "winner-takes-all" | "top-3-split";

export type TransactionState =
  | "idle"
  | "confirm"
  | "pending"
  | "success"
  | "failed";

export type BatchStatus =
  | "open"
  | "gates-running"
  | "judging"
  | "result-in-transit"
  | "paid"
  | "disputed";

export type GateType =
  | "ci-green"
  | "tests-present"
  | "diff-size"
  | "not-draft"
  | "default-branch";

export type GateResult = {
  type: GateType;
  passed: boolean;
  message: string;
};

export type PullRequest = {
  id: string;
  number: number;
  title: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  headSha: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  isDraft: boolean;
  ciStatus: "success" | "pending" | "failed";
  targetBranch: string;
  description: string;
  labels: string[];
  language: string;
  projectId: string;
  projectName: string;
  disqualified?: boolean;
  disqualificationReason?: string;
  gateResults?: GateResult[];
};

export type RubricTemplate = "bug-fix" | "feature" | "docs" | "design";

export type Rubric = {
  template: RubricTemplate;
  criteria: string[];
  customCriteria?: string[];
};

export type ReviewBatch = {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  maintainer: string;
  maintainerAvatar: string;
  rubric: Rubric;
  rubricLocked: boolean;
  rewardPool: number;
  stablecoin: string;
  chain: Chain;
  deadline: string;
  payoutMode: PayoutMode;
  status: BatchStatus;
  selectedPRs: string[]; // PR IDs
  createdAt: string;
  completedAt?: string;
  winnerId?: string;
  ranking?: JudgingRanking[];
  escrowTxHash?: string;
  payoutTxHash?: string;
};

export type JudgingRanking = {
  prId: string;
  rank: number;
  reason: string;
  score: number;
};

export type JudgingResult = {
  batchId: string;
  winnerId: string;
  ranking: JudgingRanking[];
  consensusReached: boolean;
  validatorCount: number;
  completedAt: string;
};

export type Contributor = {
  id: string;
  address: string;
  username: string;
  avatar: string;
  githubUsername: string;
  wins: number;
  totalEarnings: number;
  reputationScore: number;
  prsSubmitted: number;
  joinedAt: string;
  bio?: string;
  twitter?: string;
  website?: string;
};

export type Campaign = {
  id: string;
  name: string;
  sponsor: string;
  sponsorLogo: string;
  description: string;
  budget: number;
  spent: number;
  chain: Chain;
  themes: string[];
  eligibleProjects: string[];
  startDate: string;
  endDate: string;
  batchesCreated: number;
  prsReviewed: number;
  activeContributors: number;
  status: "active" | "completed" | "upcoming";
};

export type GrantMilestone = {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "released";
  evidence?: string[];
  completedAt?: string;
};

export type Grant = {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  maintainer: string;
  goal: string;
  description: string;
  totalBudget: number;
  chain: Chain;
  milestones: GrantMilestone[];
  status: "pending" | "active" | "completed" | "rejected";
  appliedAt: string;
  approvedAt?: string;
  completedAt?: string;
};

export type WalletState = {
  connected: boolean;
  address: string | null;
  balance: number;
  chainId: string;
};

export type NotificationSettings = {
  prSelected: boolean;
  judgingComplete: boolean;
  payoutReady: boolean;
  campaignUpdates: boolean;
  grantUpdates: boolean;
};

export type UserRole = "contributor" | "maintainer";

export type Session = {
  walletAddress: string | null;
  githubHandle: string | null;
  activeRole: UserRole;
  maintainerEnabled: boolean;
  connectedProjects: string[]; // projectIds
};

export type Payout = {
  id: string;
  batchId: string;
  prId: string;
  contributorId: string;
  amount: number;
  stablecoin: string;
  chain: Chain;
  status: "pending" | "claimable" | "claimed" | "in-transit";
  walletLinked: boolean;
  claimedAt?: string;
  txHash?: string;
};

export type AppealStatus =
  | "not-filed"
  | "filed"
  | "under-review"
  | "resolved-accepted"
  | "resolved-rejected";

export type Appeal = {
  id: string;
  batchId: string;
  prId: string;
  contributorId: string;
  reason: string;
  status: AppealStatus;
  filedAt: string;
  resolvedAt?: string;
  resolution?: string;
};

export type DemoPersona = {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  walletAddress: string;
  githubHandle: string;
  maintainerEnabled: boolean;
  connectedProjects: string[];
};

// Task/Bounty system
export type TaskStatus =
  | "open"
  | "in-progress"
  | "submitted"
  | "judging"
  | "completed"
  | "expired";

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  maintainer: string;
  maintainerAvatar: string;
  issueUrl: string; // Link to GitHub issue
  rewardAmount: number;
  stablecoin: string;
  chain: Chain;
  rubric: Rubric;
  deadline: string;
  status: TaskStatus;
  maxContributors: number; // How many can apply (default 15)
  applicants: string[]; // Contributor IDs who applied
  submissions: TaskSubmission[];
  createdAt: string;
  completedAt?: string;
  winnerId?: string;
};

export type TaskSubmission = {
  id: string;
  taskId: string;
  contributorId: string;
  contributorName: string;
  contributorAvatar: string;
  prUrl: string; // Required: link to actual GitHub PR
  prNumber: number;
  headSha: string; // Commit SHA when submitted
  submittedAt: string;
  gateResults?: GateResult[];
  rank?: number;
  validatorReason?: string;
  score?: number;
  disqualified?: boolean;
  disqualificationReason?: string;
};

export type TaskApplication = {
  id: string;
  taskId: string;
  contributorId: string;
  contributorName: string;
  contributorAvatar: string;
  appliedAt: string;
  status: "applied" | "working" | "submitted" | "withdrawn";
  submissionId?: string; // Link to submission once PR is created
};
