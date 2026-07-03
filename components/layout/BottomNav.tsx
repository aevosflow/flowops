"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Receipt, Lock, History, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/secrets-vault", label: "Vault", icon: Lock },
  { href: "/history", label: "History", icon: History },
];

export function BottomNav({ onLogExpense }: { onLogExpense: () => void }) {
  const pathname = usePathname();
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-zinc-800 bg-[#09090b]/95 px-4 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
      {left.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
              active ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </Link>
        );
      })}

      <div className="flex flex-1 justify-center">
        <button
          onClick={onLogExpense}
          aria-label="Log a new expense"
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>

      {right.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
              active ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
