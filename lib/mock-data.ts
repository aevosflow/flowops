import {
  ComplianceItem,
  DashboardKpis,
  Expense,
  Founder,
  FounderPayout,
  Secret,
  VaultActivityEvent,
} from "./types";

export const FOUNDERS: Founder[] = [
  { id: "abdul", name: "Abdul Rehman", role: "Co-Founder", avatarInitials: "AR" },
  { id: "shaheer", name: "Shaheer Khan", role: "Co-Founder", avatarInitials: "SK" },
  { id: "haseeb", name: "Haseeb Ur Rehman", role: "Co-Founder", avatarInitials: "HR" },
];

export const DASHBOARD_KPIS: DashboardKpis = {
  grossRevenue: 0,
  grossRevenueDeltaLabel: "",
  activeMrrBurn: 0,
  activeMrrBurnDeltaLabel: "",
  netProfitPool: 0,
  netProfitPoolLabel: "",
  runwayMonths: 0,
  runwayLabel: "",
};

// PRD 2: Individual Founder Payout = ((Net Profit * (1 - bufferRate)) / 3) + Individual Reimbursements
export const BUFFER_RATE = 0.03;

export const FOUNDER_REIMBURSEMENTS: Record<string, number> = {};

export function computeFounderPayouts(
  netProfit: number,
  bufferRate: number = BUFFER_RATE
): FounderPayout[] {
  const distributable = netProfit * (1 - bufferRate);
  const basePayout = distributable / 3;
  return FOUNDERS.map((f) => ({
    founderId: f.id,
    basePayout,
    reimbursements: FOUNDER_REIMBURSEMENTS[f.id] ?? 0,
  }));
}

export const PROPOSED_EXPENSES: Expense[] = [];

export const RECENT_EXPENSES: Expense[] = [];

export const SECRETS: Secret[] = [];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: "c1", label: "2FA Enforced", description: "Global requirement", enabled: true },
  { id: "c2", label: "Audit Logs Active", description: "CloudTrail/S3 Stream", enabled: true },
  { id: "c3", label: "SOC2 Compliance", description: "Annual audit pending", enabled: false },
  { id: "c4", label: "Network Isolation", description: "VPC Peering Enabled", enabled: true },
];

export const VAULT_ACTIVITY: VaultActivityEvent[] = [];

export const EXPENSE_CATEGORIES = [
  "Infrastructure",
  "Supplies",
  "Marketing",
  "Cloud Infrastructure",
  "SaaS Subscriptions",
  "Travel & Meals",
] as const;

export const CURRENCIES = ["USD", "EUR", "GBP", "PKR"] as const;

export function founderById(id: string): Founder | undefined {
  return FOUNDERS.find((f) => f.id === id);
}
