"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Secret } from "@/lib/types";

const ENVIRONMENTS: Secret["environment"][] = [
  "Production",
  "Live Payment",
  "Critical Data",
  "Service Mesh",
];

export function NewSecretModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    environment: Secret["environment"];
    name: string;
    value: string;
  }) => Promise<{ success: boolean; error?: string }>;
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [environment, setEnvironment] = useState<Secret["environment"]>("Production");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setName("");
    setValue("");
    setEnvironment("Production");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !value || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({ environment, name, value });
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
          <h3 className="font-display text-base font-semibold text-zinc-100">New secret</h3>
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
            <label className="mb-1 block text-xs font-medium text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. STRIPE_SECRET_KEY"
              required
              className="fig w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk_live_..."
              required
              type="password"
              className="fig w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Environment</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as Secret["environment"])}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-600 focus:outline-none"
            >
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
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
            disabled={!name || !value || submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? "Saving..." : "Save secret"}
          </button>
        </div>
      </form>
    </div>
  );
}
