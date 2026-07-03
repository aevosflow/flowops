"use client";

import { useState } from "react";
import { Search, Bell, Settings, X } from "lucide-react";
import { initials } from "@/lib/utils";

export function Topbar({
  title,
  subtitle,
  onLogExpense,
}: {
  title: string;
  subtitle?: string;
  onLogExpense?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    // In production, this would trigger search across expenses, secrets, projects, etc.
    if (e.target.value) {
      console.log("Searching for:", e.target.value);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-800 bg-[#09090b]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mr-auto hidden sm:block">
        <h1 className="font-display text-lg font-semibold text-zinc-100">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>

      <div className="relative hidden flex-1 max-w-sm md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search operations..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-emerald-600 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        aria-label="Notifications"
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        aria-label="Settings"
        className="hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors sm:inline-flex"
      >
        <Settings className="h-4 w-4" />
      </button>

      {onLogExpense && (
        <button
          onClick={onLogExpense}
          className="hidden rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400 sm:inline-flex"
        >
          Log Expense
        </button>
      )}

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
        {initials("Admin User")}
      </div>
    </header>
  );
}
