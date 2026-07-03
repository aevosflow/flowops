"use client";

import { useState, useTransition } from "react";
import { Download, History as HistoryIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { ComplianceItem } from "@/lib/types";
import { toggleCompliance } from "@/app/actions/compliance";

function Toggle({
  enabled,
  disabled,
  onChange,
}: {
  enabled: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50",
        enabled ? "bg-emerald-500" : "bg-zinc-700"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
          enabled ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function ComplianceList({ items }: { items: ComplianceItem[] }) {
  const [list, setList] = useState(items);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const enabledCount = list.filter((i) => i.enabled).length;
  const pct = list.length > 0 ? Math.round((enabledCount / list.length) * 100) : 0;

  function toggle(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const result = await toggleCompliance({ id });
      if (result.success) {
        setList((prev) => prev.map((i) => (i.id === id ? result.item : i)));
      }
      setPendingId(null);
    });
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-zinc-100">Compliance</h3>
        <Badge tone={pct === 100 ? "emerald" : "amber"}>{pct}% Secure</Badge>
      </div>

      <ul className="space-y-3">
        {list.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">{item.label}</p>
              <p className="text-[11px] text-zinc-500">{item.description}</p>
            </div>
            <Toggle
              enabled={item.enabled}
              disabled={isPending && pendingId === item.id}
              onChange={() => toggle(item.id)}
            />
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
          Quick Actions
        </p>
        <button className="flex w-full items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200">
          <Download className="h-3.5 w-3.5" /> Export Audit Report
        </button>
        <button className="flex w-full items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200">
          <HistoryIcon className="h-3.5 w-3.5" /> View Revision History
        </button>
      </div>
    </Card>
  );
}
