"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Receipt,
  FolderKanban,
  Lock,
  History,
  Plus,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/secrets-vault", label: "Secrets Vault", icon: Lock },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar({ onLogExpense }: { onLogExpense: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-800 bg-[#09090b] lg:flex">
      <div className="px-5 pt-6 pb-5">
        <p className="font-display text-lg font-bold tracking-tight text-emerald-400">
          FlowOps
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Enterprise Console
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-l-2 border-emerald-500 bg-zinc-900 text-emerald-400"
                  : "border-l-2 border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-zinc-800 p-3">
        <button
          onClick={onLogExpense}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Log Expense
        </button>

        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
            {initials("Admin User")}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-zinc-200">Admin User</p>
            <p className="text-[11px] text-zinc-500">admin@flowops.tech</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
