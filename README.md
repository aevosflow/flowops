# FlowOps — Internal Operations & Financial Cockpit

Frontend architecture for Aevos Flow's internal ERP: expense governance,
founder payout splitting, a secrets vault UI, and audit history — built
against the FlowOps PRD and the four dark-theme mockups.

## Stack

- **Next.js 14 (App Router)** — file-based routing, server components by default
- **Tailwind CSS** — utility styling, dark theme tokens in `tailwind.config.ts`
- **TypeScript** — shared domain types in `lib/types.ts`
- **lucide-react** — icon set
- **geist** + **next/font/google** — Geist (headers), Geist Mono (all numeric figures), Inter (body/UI)

## Getting started (with the Supabase backend)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **Settings → API**, copy the Project URL, `anon` public key, and `service_role` secret key.
3. Copy `.env.local.example` to `.env.local` and fill in the three values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
4. Open the Supabase **SQL Editor**, paste the contents of `schema.sql`, and run it. This creates every table, seeds the 3 founders and 4 default compliance items, and enables Row Level Security (all writes go through Server Actions using the service-role key, which bypasses RLS).
5. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

Visit `http://localhost:3000` — it redirects to `/dashboard`. Every form now writes to Supabase; data persists across refreshes and deploys.

### What's wired up

- **Expenses** — `Log Expense` inserts a row and shows up instantly in the vote queue. Approve/Reject calls `voteOnExpense`, which tallies votes and flips status to `approved`/`rejected` at a 2-of-3 majority.
- **Projects** — `Add Project` persists via `createProject`.
- **Secrets Vault** — `New Secret` creates a row; `Reveal` and the per-card rotate button call real Server Actions and log to `vault_activity` + `audit_events`; `Rotate Keys` rotates every secret.
- **Compliance** — toggles call `toggleCompliance` and log a `compliance_change` audit event.
- **History** — pulls the live `audit_events` table, split into Financial vs. Governance tabs.
- **Search** (desktop topbar) — debounced `globalSearch` Server Action queries expenses, projects, and secrets by name.

### Deploying

1. Push this repo to GitHub.
2. Import it into Vercel, add the same three env vars under **Settings → Environment Variables**.
3. Deploy — no other setup needed.

## Structure

```
app/
  layout.tsx              root layout, font wiring
  page.tsx                redirects to /dashboard
  dashboard/page.tsx       KPI grid, founder payouts, expense voting queue
  expenses/page.tsx        burn stats + expenses ledger table
  secrets-vault/page.tsx   secret cards, compliance toggles, activity log
  projects/page.tsx        placeholder for PRD 3.3/3.4 (CRM + project costing)
  history/page.tsx         tabbed financial vs governance audit trail
components/
  layout/                 Sidebar, BottomNav, Topbar, AppShell
  dashboard/              KpiGrid, FounderPayoutGrid, ExpenseQueue
  expenses/               BurnStats, ExpensesTable, ExpenseModal
  secrets/                SecretCard, ComplianceList, VaultActivityTable
  ui/                     Card, Badge primitives
lib/
  types.ts                domain model (Expense, Secret, Founder, ...)
  mock-data.ts            seed data + computeFounderPayouts()
  utils.ts                cn(), currency/date formatting
```

## Design system

- Backgrounds: `#09090b` (app shell) / `#0f1117` (cards) — thin `border-zinc-800` grid lines throughout.
- Accents: `emerald-500` (positive/success/revenue), `amber-500` (pending), `red-500` (expense/rejected/blocked).
- Typography: Geist for headers (`font-display`), Inter for body/labels (`font-body`), Geist Mono with `tabular-nums` for every dynamic number (`.fig` utility class) so financial columns align vertically.

## Responsive behavior

- **Desktop (`lg:` and up):** persistent left sidebar with nav links, "Admin User" node, and a `+ Log Expense` button.
- **Mobile:** sidebar is replaced by a sticky bottom nav with a centered circular floating action button that opens the same expense modal.
- KPI cards collapse into a swipeable, snap-scrolling single row on small screens.
- The expenses table hides secondary columns below `sm:`/`md:` and mobile rows open a bottom-drawer detail sheet on tap instead.

## Business logic

- `computeFounderPayouts()` in `lib/mock-data.ts` implements the PRD formula:
  `Individual Payout = ((Net Profit × (1 − Buffer Rate)) / 3) + Individual Reimbursements`.
  The dashboard label intentionally renders the simplified form as plain text
  (`Logic: Payout = (Net Profit / 3) + Expenses`), per the design spec — not LaTeX.
- The expense voting queue (`components/dashboard/ExpenseQueue.tsx`) is a client
  component with local `useState` standing in for the async 2/3 or 3/3 majority
  vote described in PRD 3.2. Wire `decide()` to a Server Action that records a
  `founder_id` + `vote` row and flips `status` once consensus is reached.

## Soft delete constraint (PRD Section 4)

No table model in this app issues a hard `DELETE`. Every entity (`Expense`,
`Secret`) carries a `deletedAt: string | null` field. Removing a row should
always be implemented as a Server Action that sets `deleted_at = now()`;
list queries then filter on `deleted_at IS NULL` so historical financial
calculations stay intact.

## What's mocked vs. real

Everything on screen is wired to local mock data and `useState` so every
interaction (approve/reject, reveal secret, toggle compliance, tab switch,
drag-and-drop receipt) is instantly clickable. None of it is a real backend:

- The Secrets Vault renders **fake placeholder values** — there is no real
  encryption, and `revealedValue` in `lib/mock-data.ts` must never hold a
  live credential. Wire real secret storage server-side only, per PRD 3.5 /
  Non-Functional Requirement on decrypted credentials never reaching the client.
- Expense approval, payout math, and vault activity are display-only; connect
  them to Server Actions and your Postgres schema before treating any number
  here as authoritative.
