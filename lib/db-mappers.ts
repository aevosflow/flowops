import {
  AuditEvent,
  ComplianceItem,
  Expense,
  ExpenseVote,
  Project,
  Secret,
  VaultActivityEvent,
} from "./types";

export function mapExpense(row: any, votes: ExpenseVote[] = []): Expense {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    amount: Number(row.amount),
    currency: row.currency,
    paidBy: row.paid_by,
    proposedAt: row.proposed_at,
    status: row.status,
    votes,
    projectId: row.project_id ?? undefined,
    receiptUrl: row.receipt_url ?? undefined,
    deletedAt: row.deleted_at,
  };
}

export function mapVote(row: any): ExpenseVote {
  return {
    founderId: row.founder_id,
    vote: row.vote,
    votedAt: row.voted_at,
  };
}

export function mapProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    client: row.client,
    status: row.status,
    budget: Number(row.budget),
    spent: Number(row.spent),
    currency: row.currency,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    margin: Number(row.margin),
  };
}

export function mapSecret(row: any): Secret {
  return {
    id: row.id,
    environment: row.environment,
    name: row.name,
    maskedValue: row.masked_value,
    revealedValue: row.revealed_value,
    status: row.status,
    deletedAt: row.deleted_at,
  };
}

export function mapCompliance(row: any): ComplianceItem {
  return {
    id: row.id,
    label: row.label,
    description: row.description ?? "",
    enabled: row.enabled,
  };
}

export function mapVaultActivity(row: any): VaultActivityEvent {
  return {
    id: row.id,
    event: row.event,
    secretName: row.secret_name,
    userLabel: row.user_label,
    timestamp: row.timestamp,
    status: row.status,
  };
}

export function mapAuditEvent(row: any): AuditEvent {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    actor: row.actor,
    timestamp: row.timestamp,
    details: row.details ?? undefined,
  };
}
