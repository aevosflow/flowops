import { AppShell } from "@/components/layout/AppShell";
import { BurnStats } from "@/components/expenses/BurnStats";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { getRecentExpenses } from "@/app/actions/expenses";

export default async function ExpensesPage() {
  const expenses = await getRecentExpenses();

  const monthlyBurn = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingClaims = expenses.filter((e) => e.status === "pending").length;

  return (
    <AppShell title="Expenses" subtitle="Track burn, claims, and vault capacity">
      <div className="space-y-6">
        <BurnStats
          monthlyBurn={monthlyBurn}
          burnDeltaPct={0}
          pendingClaims={pendingClaims}
          vaultCapacityPct={0}
        />
        <ExpensesTable expenses={expenses} />
      </div>
    </AppShell>
  );
}
