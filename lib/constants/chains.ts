import { Chain } from "@/lib/types";

export const CHAINS: Record<string, Chain> = {
  base: {
    id: "base",
    name: "Base",
    symbol: "ETH",
    logo: "🔵",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    logo: "🔷",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    logo: "⟠",
  },
  genlayer: {
    id: "genlayer",
    name: "GenLayer Testnet",
    symbol: "GEN",
    logo: "⚡",
    testnet: true,
  },
};

export const DEFAULT_CHAIN = CHAINS.base;

export const RUBRIC_TEMPLATES = {
  "bug-fix": {
    name: "Bug Fix",
    criteria: [
      "Root cause clearly identified",
      "Fix is minimal and targeted",
      "Tests added for the bug",
      "No regressions introduced",
      "Edge cases handled",
    ],
  },
  feature: {
    name: "Feature Addition",
    criteria: [
      "Feature matches specification",
      "Code is well-structured",
      "Comprehensive test coverage",
      "Documentation updated",
      "Backward compatible",
    ],
  },
  docs: {
    name: "Documentation",
    criteria: [
      "Clear and accurate information",
      "Examples are practical",
      "Grammar and formatting correct",
      "Links work correctly",
      "Covers common use cases",
    ],
  },
  design: {
    name: "Design Implementation",
    criteria: [
      "Matches design specifications",
      "Responsive across devices",
      "Accessible (WCAG compliant)",
      "Performance optimized",
      "Consistent with design system",
    ],
  },
};

export const STABLECOINS = ["USDC", "USDT", "DAI"];

export const GATE_DESCRIPTIONS: Record<string, string> = {
  "ci-green": "CI checks must pass",
  "tests-present": "Must include test coverage",
  "diff-size": "Changes must be under 1000 lines",
  "not-draft": "Cannot be a draft PR",
  "default-branch": "Must target default branch",
};
