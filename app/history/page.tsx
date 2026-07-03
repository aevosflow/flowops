"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "financial", label: "Financial & Settlement History" },
  { id: "governance", label: "Operations & Governance Audit Trail" },
] as const;

export default function HistoryPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("financial");

  return (
    <AppShell title="History" subtitle="Immutable monthly and audit records">
      <div className="mb-5 flex gap-1 rounded-lg border border-zinc-800 bg-[#0f1117] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
              tab === t.id
                ? "bg-emerald-500 text-black"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "financial" ? (
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-zinc-100">
            Immutable Monthly Snapshot Archive
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Read-only breakdowns of past months — gross revenue, deducted subscriptions,
            deducted expenses, and base payout splits. Snapshots are locked once a month
            closes and never overwritten.
          </p>
        </Card>
      ) : (
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-zinc-100">
            Voting History Ledger
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Read-only catalog of who proposed each item, who voted for or against it, and
            when it reached consensus, alongside vault access logs and compliance retro
            records.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
