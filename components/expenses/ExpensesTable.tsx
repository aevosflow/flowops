"use client";

import { useState } from "react";
import { Filter, Download, MoreVertical, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { founderById } from "@/lib/mock-data";
import { cn, formatCurrency, formatDate, initials } from "@/lib/utils";
import { Expense } from "@/lib/types";

function FounderCell({ founderId }: { founderId: string }) {
  const f = founderById(founderId);
  if (!f) return null;
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-400">
        {f.avatarInitials}
      </span>
      <span className="text-sm text-zinc-300">{f.name}</span>
    </span>
  );
}

function DetailSheet({ expense, onClose }: { expense: Expense; onClose: () => void }) {
  const founder = founderById(expense.paidBy);
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm sm:hidden">
      <div className="animate-fade-in w-full rounded-t-2xl border border-zinc-800 bg-[#0f1117] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-zinc-100">
            Expense detail
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Title</dt>
            <dd className="text-zinc-200">{expense.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Category</dt>
            <dd className="text-zinc-200">{expense.category}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Founder / Source</dt>
            <dd className="text-zinc-200">{founder?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Amount</dt>
            <dd className="fig text-zinc-100">
              {formatCurrency(expense.amount, expense.currency)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Date</dt>
            <dd className="fig text-zinc-200">{formatDate(expense.proposedAt)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-zinc-500">Status</dt>
            <dd>
              <Badge tone={statusTone(expense.status)}>{expense.status}</Badge>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  const [selected, setSelected] = useState<Expense | null>(null);

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">
        <h2 className="font-display text-base font-semibold text-zinc-100">
          Recent Expenses
        </h2>
        <div className="flex gap-2">
          <button
            aria-label="Filter"
            className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-900"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            aria-label="Export"
            className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-900"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop / tablet table: secondary columns hidden below md */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-2.5 font-medium">Date</th>
              <th className="px-5 py-2.5 font-medium">Category</th>
              <th className="hidden px-5 py-2.5 font-medium md:table-cell">
                Founder / Source
              </th>
              <th className="px-5 py-2.5 font-medium">Amount</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-t border-zinc-800/60 hover:bg-zinc-900/40">
                <td className="fig px-5 py-3 text-zinc-400">{formatDate(e.proposedAt)}</td>
                <td className="px-5 py-3">
                  <Badge tone="zinc">{e.category}</Badge>
                </td>
                <td className="hidden px-5 py-3 md:table-cell">
                  <FounderCell founderId={e.paidBy} />
                </td>
                <td className="fig px-5 py-3 font-medium text-zinc-100">
                  {formatCurrency(e.amount, e.currency)}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={statusTone(e.status)} dot>
                    {e.status}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <button className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: single-column rows that open a detail sheet on tap */}
      <ul className="divide-y divide-zinc-800/60 sm:hidden">
        {expenses.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => setSelected(e)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">{e.title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  {formatDate(e.proposedAt)} • {e.category}
                </p>
              </div>
              <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                <span className="fig text-sm font-semibold text-zinc-100">
                  {formatCurrency(e.amount, e.currency)}
                </span>
                <Badge tone={statusTone(e.status)}>{e.status}</Badge>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selected && <DetailSheet expense={selected} onClose={() => setSelected(null)} />}
    </Card>
  );
}
