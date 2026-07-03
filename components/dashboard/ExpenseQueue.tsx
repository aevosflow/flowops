"use client";

import { useState, useTransition } from "react";
import { Check, X, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { founderById, FOUNDERS } from "@/lib/mock-data";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { Expense } from "@/lib/types";
import { voteOnExpense } from "@/app/actions/expenses";

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

// In production this would come from an auth session. For now the acting
// founder is whoever is "logged in" — defaults to the first founder.
const CURRENT_FOUNDER = FOUNDERS[0].id;

export function ExpenseQueue({ expenses }: { expenses: Expense[] }) {
  const [items, setItems] = useState(expenses);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function decide(id: string, decision: "approve" | "reject") {
    setPendingId(id);
    startTransition(async () => {
      const result = await voteOnExpense({
        expenseId: id,
        founderId: CURRENT_FOUNDER,
        vote: decision,
      });

      if (result.success && result.status !== "pending") {
        // Majority reached — remove from the pending queue.
        setItems((prev) => prev.filter((e) => e.id !== id));
      } else if (result.success) {
        // Still pending — reflect the new vote locally.
        setItems((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  votes: [
                    ...e.votes.filter((v) => v.founderId !== CURRENT_FOUNDER),
                    { founderId: CURRENT_FOUNDER, vote: decision, votedAt: new Date().toISOString() },
                  ],
                }
              : e
          )
        );
      }
      setPendingId(null);
    });
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

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-display text-sm font-semibold text-zinc-200">Queue is clear</p>
          <p className="mt-1 text-xs text-zinc-500">No expenses awaiting a founder vote right now.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const proposer = founderById(item.paidBy);
            const myVote = item.votes.find((v) => v.founderId === CURRENT_FOUNDER)?.vote;
            const approveCount = item.votes.filter((v) => v.vote === "approve").length;
            const rejectCount = item.votes.filter((v) => v.vote === "reject").length;
            const busy = isPending && pendingId === item.id;

            return (
              <Card key={item.id} className="flex flex-col p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <Badge tone={CATEGORY_TONE[item.category] ?? "zinc"}>{item.category}</Badge>
                  <span className="fig text-sm font-semibold text-zinc-100">
                    {formatCompactCurrency(item.amount)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
                  {item.description}
                </p>

                <p className="mt-3 text-[11px] text-zinc-600">
                  <span className="font-medium text-zinc-400">{proposer?.avatarInitials}</span>{" "}
                  Proposed by {proposer?.name.split(" ")[0]} • {timeAgo(item.proposedAt)}
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  {approveCount}/3 approve • {rejectCount}/3 reject
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    disabled={busy}
                    onClick={() => decide(item.id, "reject")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                      myVote === "reject"
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    )}
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => decide(item.id, "approve")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-black transition-colors disabled:opacity-50",
                      myVote === "approve" ? "bg-emerald-400" : "bg-emerald-500 hover:bg-emerald-400"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
