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
  { id: "abdul", name: "Abdul Rehman", role: "CTO / Co-Founder", avatarInitials: "AR" },
  { id: "shaheer", name: "Shaheer Khan", role: "CEO / Co-Founder", avatarInitials: "SK" },
  { id: "haseeb", name: "Haseeb Ur Rehman", role: "COO / Co-Founder", avatarInitials: "HR" },
];

export const DASHBOARD_KPIS: DashboardKpis = {
  grossRevenue: 1_200_000,
  grossRevenueDeltaLabel: "+12.4% vs last month",
  activeMrrBurn: 45_000,
  activeMrrBurnDeltaLabel: "+2.1% increase in opex",
  netProfitPool: 320_000,
  netProfitPoolLabel: "Calculated after tax & burn",
  runwayMonths: 18,
  runwayLabel: "Current burn-rate projection",
};

// PRD 2: Individual Founder Payout = ((Net Profit * (1 - bufferRate)) / 3) + Individual Reimbursements
export const BUFFER_RATE = 0.03;

export const FOUNDER_REIMBURSEMENTS: Record<string, number> = {
  abdul: 1_240,
  shaheer: 450,
  haseeb: 2_890,
};

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

export const PROPOSED_EXPENSES: Expense[] = [
  {
    id: "exp_p1",
    title: "Cloud Servers",
    description: "Monthly AWS & Vercel deployment costs for Q4 infrastructure scaling.",
    category: "Infrastructure",
    amount: 2_400,
    currency: "USD",
    paidBy: "abdul",
    proposedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "pending",
    votes: [],
    deletedAt: null,
  },
  {
    id: "exp_p2",
    title: "Office Supplies",
    description: "Restock for ergonomic peripherals and stationery for HQ desk B.",
    category: "Supplies",
    amount: 128,
    currency: "USD",
    paidBy: "shaheer",
    proposedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "pending",
    votes: [],
    deletedAt: null,
  },
  {
    id: "exp_p3",
    title: "Conf Sponsorship",
    description: "Platinum booth for upcoming DevOps World conference in London.",
    category: "Marketing",
    amount: 8_500,
    currency: "USD",
    paidBy: "haseeb",
    proposedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "pending",
    votes: [],
    deletedAt: null,
  },
];

export const RECENT_EXPENSES: Expense[] = [
  {
    id: "exp_1",
    title: "AWS Q3 Baseline",
    category: "Cloud Infrastructure",
    amount: 1_450,
    currency: "USD",
    paidBy: "shaheer",
    proposedAt: "2023-10-24T00:00:00.000Z",
    status: "approved",
    votes: [],
    deletedAt: null,
  },
  {
    id: "exp_2",
    title: "Notion Team Plan",
    category: "SaaS Subscriptions",
    amount: 299,
    currency: "USD",
    paidBy: "haseeb",
    proposedAt: "2023-10-23T00:00:00.000Z",
    status: "pending",
    votes: [],
    deletedAt: null,
  },
  {
    id: "exp_3",
    title: "Client Onsite Travel",
    category: "Travel & Meals",
    amount: 85.4,
    currency: "USD",
    paidBy: "shaheer",
    proposedAt: "2023-10-22T00:00:00.000Z",
    status: "rejected",
    votes: [],
    deletedAt: null,
  },
];

export const SECRETS: Secret[] = [
  {
    id: "sec_1",
    environment: "Production",
    name: "AWS_SECRET_KEY",
    maskedValue: "••••••••••••••••••••••••",
    revealedValue: "AKIA-MOCK-7F91-XXXXXXXX",
    status: "secure",
    deletedAt: null,
  },
  {
    id: "sec_2",
    environment: "Live Payment",
    name: "STRIPE_API_LIVE",
    maskedValue: "••••••••••••••••••••••••",
    revealedValue: "sk_live_mock_9d21XXXXXXXX",
    status: "warning",
    deletedAt: null,
  },
  {
    id: "sec_3",
    environment: "Critical Data",
    name: "PG_MASTER_PASSWORD",
    maskedValue: "••••••••••••••••••••••••",
    revealedValue: "correct-horse-battery-mock",
    status: "critical",
    deletedAt: null,
  },
  {
    id: "sec_4",
    environment: "Service Mesh",
    name: "REDIS_AUTH_TOKEN",
    maskedValue: "••••••••••••••••••••••••",
    revealedValue: "redis-mock-auth-7729XXXXXXXX",
    status: "secure",
    deletedAt: null,
  },
];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: "c1", label: "2FA Enforced", description: "Global requirement", enabled: true },
  { id: "c2", label: "Audit Logs Active", description: "CloudTrail/S3 Stream", enabled: true },
  { id: "c3", label: "SOC2 Compliance", description: "Annual audit pending", enabled: false },
  { id: "c4", label: "Network Isolation", description: "VPC Peering Enabled", enabled: true },
];

export const VAULT_ACTIVITY: VaultActivityEvent[] = [
  {
    id: "v1",
    event: "REVEAL_VALUE",
    secretName: "AWS_SECRET_KEY",
    userLabel: "a.rehman@flowops.tech",
    timestamp: "2023-10-24T14:22:10.000Z",
    status: "success",
  },
  {
    id: "v2",
    event: "ROTATE_CREDENTIALS",
    secretName: "STRIPE_API_LIVE",
    userLabel: "SYSTEM_AUTO",
    timestamp: "2023-10-24T13:00:01.000Z",
    status: "success",
  },
  {
    id: "v3",
    event: "UNAUTHORIZED_ACCESS",
    secretName: "PG_MASTER_PASSWORD",
    userLabel: "192.168.1.45",
    timestamp: "2023-10-24T12:45:12.000Z",
    status: "blocked",
  },
  {
    id: "v4",
    event: "SECRET_CREATED",
    secretName: "REDIS_AUTH_TOKEN",
    userLabel: "s.khan@flowops.tech",
    timestamp: "2023-10-24T11:30:45.000Z",
    status: "success",
  },
];

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
