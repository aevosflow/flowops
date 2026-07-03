"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDateTime } from "@/lib/utils";
import { AUDIT_EVENTS } from "@/lib/mock-data";

const TABS = [
  { id: "financial", label: "Financial & Settlement History" },
  { id: "governance", label: "Operations & Governance Audit Trail" },
] as const;

const EVENT_TYPE_COLORS: Record<string, "emerald" | "amber" | "sky" | "red"> = {
  expense_approved: "emerald",
  expense_rejected: "red",
  payout_distributed: "sky",
  secret_accessed: "amber",
  compliance_change: "amber",
};

export default function HistoryPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("financial");

  const filteredEvents = AUDIT_EVENTS.filter((event) => {
    if (tab === "financial") {
      return ["payout_distributed", "expense_approved", "expense_rejected"].includes(event.type);
    }
    return ["secret_accessed", "compliance_change"].includes(event.type);
  });

  return (
    <AppShell title="History" subtitle="Immutable monthly and audit records">
      <div className="mb-5 flex gap-1 rounded-lg border border-zinc-800 bg-[#0f1117] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
              tab === t.id ? "bg-emerald-500 text-black" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-zinc-100">
            {tab === "financial" ? "Financial History" : "Governance Audit Trail"}
          </h3>
          <p className="mt-3 text-xs text-zinc-500">
            {tab === "financial"
              ? "No financial events recorded yet. Financial settlements and payout distributions will appear here."
              : "No governance events recorded yet. Vault access and compliance changes will appear here."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-100">{event.description}</p>
                      <Badge tone={EVENT_TYPE_COLORS[event.type]}>
                        {event.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">by {event.actor}</p>
                    {event.details && (
                      <div className="mt-2 space-y-1 text-xs text-zinc-400">
                        {Object.entries(event.details).map(([key, value]) => (
                          <p key={key}>
                            <span className="text-zinc-500">{key}:</span> {String(value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-zinc-500">{formatDateTime(event.timestamp)}</div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </AppShell>
  );
}
