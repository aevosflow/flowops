import { AppShell } from "@/components/layout/AppShell";
import { BurnStats } from "@/components/expenses/BurnStats";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { RECENT_EXPENSES } from "@/lib/mock-data";

export default function ExpensesPage() {
  return (
    <AppShell title="Expenses" subtitle="Track burn, claims, and vault capacity">
      <div className="space-y-6">
        <BurnStats
          monthlyBurn={42_850}
          burnDeltaPct={12}
          pendingClaims={14}
          vaultCapacityPct={89}
        />
        <ExpensesTable expenses={RECENT_EXPENSES} />
      </div>
    </AppShell>
  );
}
