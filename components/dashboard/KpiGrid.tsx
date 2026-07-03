import { TrendingUp, TrendingDown, Landmark, Hourglass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { DashboardKpis } from "@/lib/types";

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "red" | "amber" | "zinc";
}) {
  const toneText = {
    emerald: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
    zinc: "text-zinc-100",
  }[tone];

  return (
    <Card className="min-w-[80%] shrink-0 snap-center p-4 sm:min-w-0 sm:p-5">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
        <Icon className={cn("h-3.5 w-3.5", toneText)} />
      </div>
      <p className={cn("fig mt-2 text-2xl font-semibold", toneText)}>{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{delta}</p>
    </Card>
  );
}

export function KpiGrid({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="scrollbar-none -mx-4 flex snap-x-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      <Kpi
        label="Gross Revenue"
        value={formatCompactCurrency(kpis.grossRevenue)}
        delta={kpis.grossRevenueDeltaLabel}
        icon={TrendingUp}
        tone="emerald"
      />
      <Kpi
        label="Active MRR Burn"
        value={formatCompactCurrency(kpis.activeMrrBurn)}
        delta={kpis.activeMrrBurnDeltaLabel}
        icon={TrendingDown}
        tone="red"
      />
      <Kpi
        label="Net Profit Pool"
        value={formatCompactCurrency(kpis.netProfitPool)}
        delta={kpis.netProfitPoolLabel}
        icon={Landmark}
        tone="zinc"
      />
      <Kpi
        label="Runway"
        value={`${kpis.runwayMonths} Months`}
        delta={kpis.runwayLabel}
        icon={Hourglass}
        tone="amber"
      />
    </div>
  );
}
