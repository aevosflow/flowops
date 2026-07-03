-- =========================================================
-- FlowOps Database Schema (Supabase / Postgres)
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New Query
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING where sensible.
-- =========================================================

-- ---------- founders ----------
create table if not exists founders (
  id text primary key,                 -- 'abdul' | 'shaheer' | 'haseeb'
  name text not null,
  role text not null,
  avatar_initials text not null
);

insert into founders (id, name, role, avatar_initials) values
  ('abdul', 'Abdul Rehman', 'Co-Founder', 'AR'),
  ('shaheer', 'Shaheer Khan', 'Co-Founder', 'SK'),
  ('haseeb', 'Haseeb Ur Rehman', 'Co-Founder', 'HR')
on conflict (id) do nothing;

-- ---------- projects ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text not null,
  budget numeric not null default 0,
  spent numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'active' check (status in ('active','completed','on-hold')),
  start_date timestamptz not null default now(),
  end_date timestamptz,
  margin numeric not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_status on projects (status) where deleted_at is null;
create index if not exists idx_projects_deleted_at on projects (deleted_at);

-- ---------- expenses ----------
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  amount numeric not null,
  currency text not null default 'USD',
  paid_by text not null references founders(id),
  proposed_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  project_id uuid references projects(id) on delete set null,
  receipt_url text,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_status on expenses (status) where deleted_at is null;
create index if not exists idx_expenses_proposed_at on expenses (proposed_at desc);
create index if not exists idx_expenses_deleted_at on expenses (deleted_at);

-- ---------- expense_votes ----------
create table if not exists expense_votes (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references expenses(id) on delete cascade,
  founder_id text not null references founders(id),
  vote text not null check (vote in ('approve','reject')),
  voted_at timestamptz not null default now(),
  unique (expense_id, founder_id)
);

create index if not exists idx_expense_votes_expense_id on expense_votes (expense_id);

-- ---------- secrets ----------
create table if not exists secrets (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('Production','Live Payment','Critical Data','Service Mesh')),
  name text not null,
  masked_value text not null,
  revealed_value text not null,
  status text not null default 'secure' check (status in ('secure','warning','critical')),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_secrets_deleted_at on secrets (deleted_at);

-- ---------- compliance_items ----------
create table if not exists compliance_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  enabled boolean not null default true
);

insert into compliance_items (label, description, enabled)
select * from (values
  ('2FA Enforced', 'Global requirement', true),
  ('Audit Logs Active', 'CloudTrail/S3 Stream', true),
  ('SOC2 Compliance', 'Annual audit pending', false),
  ('Network Isolation', 'VPC Peering Enabled', true)
) as seed(label, description, enabled)
where not exists (select 1 from compliance_items);

-- ---------- vault_activity ----------
create table if not exists vault_activity (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('REVEAL_VALUE','ROTATE_CREDENTIALS','UNAUTHORIZED_ACCESS','SECRET_CREATED')),
  secret_name text not null,
  user_label text not null,
  timestamp timestamptz not null default now(),
  status text not null default 'success' check (status in ('success','blocked','warning'))
);

create index if not exists idx_vault_activity_timestamp on vault_activity (timestamp desc);

-- ---------- audit_events ----------
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'expense_created','expense_approved','expense_rejected',
    'project_created','project_updated',
    'payout_distributed','secret_accessed','secret_rotated','secret_created',
    'compliance_change'
  )),
  description text not null,
  actor text not null,           -- founder id/name or 'SYSTEM'
  timestamp timestamptz not null default now(),
  details jsonb
);

create index if not exists idx_audit_events_type on audit_events (type);
create index if not exists idx_audit_events_timestamp on audit_events (timestamp desc);

-- ---------- Row Level Security ----------
-- These tables are only ever touched via Server Actions using the service-role key,
-- so RLS stays enabled with no public policies (blocks anon/client access entirely).
alter table founders enable row level security;
alter table projects enable row level security;
alter table expenses enable row level security;
alter table expense_votes enable row level security;
alter table secrets enable row level security;
alter table compliance_items enable row level security;
alter table vault_activity enable row level security;
alter table audit_events enable row level security;
