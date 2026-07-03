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

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/dashboard`.

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
