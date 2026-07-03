import { Card } from "@/components/ui/Card";
import { FOUNDERS } from "@/lib/mock-data";
import { formatCurrency, initials } from "@/lib/utils";
import { FounderPayout } from "@/lib/types";

export function FounderPayoutGrid({ payouts }: { payouts: FounderPayout[] }) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-zinc-100">
            Founder Payout Distribution
          </h2>
          {/* Rendered as plain text per spec — not LaTeX */}
          <p className="fig mt-0.5 text-xs text-zinc-500">
            Logic: Payout = (Net Profit / 3) + Expenses
          </p>
        </div>
        <p className="hidden text-xs text-zinc-500 sm:block">Next Payout: Oct 01</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {payouts.map((p) => {
          const founder = FOUNDERS.find((f) => f.id === p.founderId)!;
          const total = p.basePayout + p.reimbursements;
          return (
            <Card key={p.founderId} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
                  {initials(founder.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{founder.name}</p>
                  <p className="text-xs text-zinc-500">{founder.role}</p>
                </div>
              </div>

              <dl className="mt-4 space-y-2 border-t border-zinc-800 pt-3">
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-zinc-500">Base Payout</dt>
                  <dd className="fig text-sm text-zinc-200">
                    {formatCurrency(p.basePayout)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-zinc-500">Reimbursements</dt>
                  <dd className="fig text-sm text-emerald-400">
                    {formatCurrency(p.reimbursements)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                  <dt className="text-xs font-medium text-zinc-400">Total</dt>
                  <dd className="fig text-base font-semibold text-emerald-400">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
