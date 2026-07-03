"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, X, Loader2 } from "lucide-react";
import { initials } from "@/lib/utils";
import { globalSearch, SearchResult } from "@/app/actions/search";

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchQuery(query);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const found = await globalSearch(query);
      setResults(found);
      setLoading(false);
    }, 300);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleSelect(result: SearchResult) {
    setSearchQuery("");
    setResults([]);
    setOpen(false);
    router.push(result.href);
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
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-9 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-emerald-600 focus:outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
        )}
        {!loading && searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && searchQuery && !loading && (
          <div className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto rounded-lg border border-zinc-800 bg-[#0f1117] py-1.5 shadow-xl">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-xs text-zinc-500">No matches for &ldquo;{searchQuery}&rdquo;</p>
            ) : (
              results.map((r) => (
                <button
                  key={`${r.kind}-${r.id}`}
                  onMouseDown={() => handleSelect(r)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-zinc-900"
                >
                  <span className="text-sm text-zinc-200">{r.title}</span>
                  <span className="text-[11px] text-zinc-500">
                    {r.kind} • {r.subtitle}
                  </span>
                </button>
              ))
            )}
          </div>
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
