"use client";

import { useState } from "react";
import { X, UploadCloud, FileCheck2, Loader2 } from "lucide-react";
import { CURRENCIES, EXPENSE_CATEGORIES, FOUNDERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ExpenseModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    amount: number;
    currency: string;
    category: string;
    paidBy: string;
  }) => Promise<{ success: boolean; error?: string }>;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<string>(CURRENCIES[0]);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [paidBy, setPaidBy] = useState<string>(FOUNDERS[0].id);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setTitle("");
    setAmount("");
    setCurrency(CURRENCIES[0]);
    setCategory(EXPENSE_CATEGORIES[0]);
    setPaidBy(FOUNDERS[0].id);
    setFileName(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({ title, amount: parseFloat(amount), currency, category, paidBy });
      if (result.success) {
        reset();
        onClose();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-in w-full max-w-md rounded-t-2xl border border-zinc-800 bg-[#0f1117] p-5 sm:rounded-xl2"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-zinc-100">
            Log an expense
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RunPod GPU credits"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Amount</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className="fig w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-600 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-600 focus:outline-none"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Paid by</label>
            <div className="flex gap-2">
              {FOUNDERS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setPaidBy(f.id)}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                    paidBy === f.id
                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                  )}
                >
                  {f.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Receipt</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) setFileName(f.name);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-3 py-6 text-center transition-colors",
                dragOver
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-zinc-800 bg-zinc-900/40"
              )}
            >
              {fileName ? (
                <>
                  <FileCheck2 className="h-5 w-5 text-emerald-400" />
                  <p className="text-xs text-zinc-300">{fileName}</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5 text-zinc-500" />
                  <p className="text-xs text-zinc-500">
                    Drag a PDF, PNG, or JPG here, or{" "}
                    <label className="cursor-pointer text-emerald-400 hover:underline">
                      browse
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFileName(f.name);
                        }}
                      />
                    </label>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-zinc-800 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-70"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? "Submitting..." : "Submit for vote"}
          </button>
        </div>
      </form>
    </div>
  );
}
