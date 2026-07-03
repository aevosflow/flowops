"use client";

import { useState } from "react";
import { Check, X, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { founderById } from "@/lib/mock-data";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { Expense } from "@/lib/types";

const CATEGORY_TONE: Record<string, "emerald" | "amber" | "sky"> = {
  Infrastructure: "sky",
  Supplies: "amber",
  Marketing: "emerald",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ExpenseQueue({ expenses }: { expenses: Expense[] }) {
  const [items, setItems] = useState(expenses);

  function decide(id: string, decision: "approved" | "rejected") {
    setItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: decision } : e))
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-zinc-100">
          Proposed Expense Queue
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-900">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-900">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => {
          const proposer = founderById(item.paidBy);
          const decided = item.status !== "pending";
          return (
            <Card key={item.id} className="flex flex-col p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <Badge tone={CATEGORY_TONE[item.category] ?? "zinc"}>
                  {item.category}
                </Badge>
                <span className="fig text-sm font-semibold text-zinc-100">
                  {formatCompactCurrency(item.amount)}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
                {item.description}
              </p>

              <p className="mt-3 text-[11px] text-zinc-600">
                <span className="font-medium text-zinc-400">
                  {proposer?.avatarInitials}
                </span>{" "}
                Proposed by {proposer?.name.split(" ")[0]} • {timeAgo(item.proposedAt)}
              </p>

              {decided ? (
                <div className="mt-3">
                  <Badge tone={item.status === "approved" ? "emerald" : "red"}>
                    {item.status}
                  </Badge>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => decide(item.id, "rejected")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                    )}
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => decide(item.id, "approved")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
