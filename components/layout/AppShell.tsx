"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Topbar } from "./Topbar";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { createExpense } from "@/app/actions/expenses";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  async function handleSubmitExpense(payload: {
    title: string;
    amount: number;
    currency: string;
    category: string;
    paidBy: string;
  }) {
    const result = await createExpense(payload);
    if (result.success) {
      router.refresh();
    }
    return result;
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <Sidebar onLogExpense={() => setModalOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} onLogExpense={() => setModalOpen(true)} />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:pb-8">
          {children}
        </main>
      </div>

      <BottomNav onLogExpense={() => setModalOpen(true)} />

      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExpense}
      />
    </div>
  );
}
