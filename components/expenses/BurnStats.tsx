import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

function ProgressBar({ pct, tone }: { pct: number; tone: "emerald" | "amber" }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className={`h-full rounded-full ${tone === "emerald" ? "bg-emerald-500" : "bg-amber-500"}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export function BurnStats({
  monthlyBurn,
  burnDeltaPct,
  pendingClaims,
  vaultCapacityPct,
}: {
  monthlyBurn: number;
  burnDeltaPct: number;
  pendingClaims: number;
  vaultCapacityPct: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Monthly Burn Rate
        </p>
        <p className="fig mt-2 flex items-center gap-2 text-2xl font-semibold text-emerald-400">
          {formatCurrency(monthlyBurn)}
          <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            {burnDeltaPct}%
          </span>
        </p>
        <ProgressBar pct={62} tone="emerald" />
      </Card>

      <Card className="p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Pending Approval
        </p>
        <p className="fig mt-2 text-2xl font-semibold text-amber-400">
          {pendingClaims}
          <span className="ml-2 text-xs font-medium text-zinc-500">claims</span>
        </p>
        <ProgressBar pct={(pendingClaims / 20) * 100} tone="amber" />
      </Card>

      <Card className="p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Vault Capacity
        </p>
        <p className="fig mt-2 text-2xl font-semibold text-zinc-100">{vaultCapacityPct}%</p>
        <ProgressBar pct={vaultCapacityPct} tone="emerald" />
      </Card>
    </div>
  );
}
