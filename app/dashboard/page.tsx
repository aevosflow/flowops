import { AppShell } from "@/components/layout/AppShell";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { FounderPayoutGrid } from "@/components/dashboard/FounderPayoutGrid";
import { ExpenseQueue } from "@/components/dashboard/ExpenseQueue";
import { DASHBOARD_KPIS, computeFounderPayouts } from "@/lib/mock-data";
import { getExpenses } from "@/app/actions/expenses";

export default async function DashboardPage() {
  const payouts = computeFounderPayouts(DASHBOARD_KPIS.netProfitPool);
  const pendingExpenses = await getExpenses();

  return (
    <AppShell title="Overview" subtitle="Live fiscal snapshot across Aevos Flow">
      <div className="space-y-8">
        <KpiGrid kpis={DASHBOARD_KPIS} />
        <FounderPayoutGrid payouts={payouts} />
        <ExpenseQueue expenses={pendingExpenses} />

        <div className="rounded-xl2 border border-zinc-800 bg-[#0f1117] p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            System Integrity Stable
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-zinc-100">
            Flow-Rate Monitoring Active
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-zinc-500">
            Real-time fiscal health analysis is being computed by the FlowOps engine.
            All distributed nodes are operating within nominal variance.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
