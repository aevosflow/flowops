export type FounderId = "abdul" | "shaheer" | "haseeb";

export interface Founder {
  id: FounderId;
  name: string;
  role: string;
  avatarInitials: string;
}

export type ExpenseStatus = "pending" | "approved" | "rejected";

export type ExpenseCategory =
  | "Infrastructure"
  | "Supplies"
  | "Marketing"
  | "Cloud Infrastructure"
  | "SaaS Subscriptions"
  | "Travel & Meals";

export interface ExpenseVote {
  founderId: FounderId;
  vote: "approve" | "reject";
  votedAt: string; // ISO timestamp
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  paidBy: FounderId;
  proposedAt: string; // ISO timestamp
  status: ExpenseStatus;
  votes: ExpenseVote[];
  projectId?: string;
  receiptUrl?: string;
  // Soft delete constraint (PRD Section 4) — never hard-deleted
  deletedAt: string | null;
}

export interface FounderPayout {
  founderId: FounderId;
  basePayout: number;
  reimbursements: number;
}

export interface DashboardKpis {
  grossRevenue: number;
  grossRevenueDeltaLabel: string;
  activeMrrBurn: number;
  activeMrrBurnDeltaLabel: string;
  netProfitPool: number;
  netProfitPoolLabel: string;
  runwayMonths: number;
  runwayLabel: string;
}

export type SecretEnvironment = "Production" | "Live Payment" | "Critical Data" | "Service Mesh";

export interface Secret {
  id: string;
  environment: SecretEnvironment;
  name: string;
  maskedValue: string;
  revealedValue: string;
  status: "secure" | "warning" | "critical";
  deletedAt: string | null;
}

export interface ComplianceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export type VaultEventStatus = "success" | "blocked" | "warning";

export interface VaultActivityEvent {
  id: string;
  event: "REVEAL_VALUE" | "ROTATE_CREDENTIALS" | "UNAUTHORIZED_ACCESS" | "SECRET_CREATED";
  secretName: string;
  userLabel: string;
  timestamp: string; // ISO timestamp
  status: VaultEventStatus;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "on-hold";
  budget: number;
  spent: number;
  currency: string;
  startDate: string; // ISO timestamp
  endDate?: string; // ISO timestamp
  margin: number; // percentage
}

export interface AuditEvent {
  id: string;
  type:
    | "expense_created"
    | "expense_approved"
    | "expense_rejected"
    | "project_created"
    | "project_updated"
    | "payout_distributed"
    | "secret_accessed"
    | "secret_rotated"
    | "secret_created"
    | "compliance_change";
  description: string;
  actor: string; // founder name or system
  timestamp: string; // ISO timestamp
  details?: Record<string, any>;
}
