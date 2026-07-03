"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { mapExpense, mapVote } from "@/lib/db-mappers";
import { founderById } from "@/lib/mock-data";
import { logAuditEvent } from "./audit";

const ACTIVE = "deleted_at.is.null";

async function fetchExpensesWithVotes(statusFilter: string[]) {
  const { data: expenseRows, error } = await supabaseAdmin
    .from("expenses")
    .select("*")
    .is("deleted_at", null)
    .in("status", statusFilter)
    .order("proposed_at", { ascending: false });

  if (error) {
    console.error("fetchExpensesWithVotes error:", error.message);
    return [];
  }
  if (!expenseRows || expenseRows.length === 0) return [];

  const ids = expenseRows.map((r) => r.id);
  const { data: voteRows, error: voteError } = await supabaseAdmin
    .from("expense_votes")
    .select("*")
    .in("expense_id", ids);

  if (voteError) {
    console.error("fetch votes error:", voteError.message);
  }

  return expenseRows.map((row) =>
    mapExpense(
      row,
      (voteRows ?? []).filter((v) => v.expense_id === row.id).map(mapVote)
    )
  );
}

export async function getExpenses() {
  return fetchExpensesWithVotes(["pending"]);
}

export async function getRecentExpenses() {
  return fetchExpensesWithVotes(["approved", "rejected"]);
}

export async function createExpense(input: {
  title: string;
  description?: string;
  category: string;
  amount: number;
  currency: string;
  paidBy: string;
  projectId?: string;
  receiptUrl?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("expenses")
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      paid_by: input.paidBy,
      project_id: input.projectId ?? null,
      receipt_url: input.receiptUrl ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  const founder = founderById(input.paidBy);
  await logAuditEvent({
    type: "expense_created",
    description: `${founder?.name ?? input.paidBy} proposed "${input.title}"`,
    actor: founder?.name ?? input.paidBy,
    details: { expenseId: data.id, amount: input.amount, currency: input.currency },
  });

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/history");

  return { success: true as const, expense: mapExpense(data, []) };
}

export async function voteOnExpense(input: {
  expenseId: string;
  founderId: string;
  vote: "approve" | "reject";
}) {
  const { error: voteError } = await supabaseAdmin.from("expense_votes").upsert(
    {
      expense_id: input.expenseId,
      founder_id: input.founderId,
      vote: input.vote,
    },
    { onConflict: "expense_id,founder_id" }
  );

  if (voteError) {
    return { success: false as const, error: voteError.message };
  }

  const { data: votes, error: votesError } = await supabaseAdmin
    .from("expense_votes")
    .select("*")
    .eq("expense_id", input.expenseId);

  if (votesError) {
    return { success: false as const, error: votesError.message };
  }

  const approveCount = votes.filter((v) => v.vote === "approve").length;
  const rejectCount = votes.filter((v) => v.vote === "reject").length;

  let newStatus: "pending" | "approved" | "rejected" = "pending";
  if (approveCount >= 1) newStatus = "approved";
  else if (rejectCount >= 1) newStatus = "rejected";

  const { data: expenseRow, error: expenseError } = await supabaseAdmin
    .from("expenses")
    .select("*")
    .eq("id", input.expenseId)
    .single();

  if (expenseError || !expenseRow) {
    return { success: false as const, error: expenseError?.message ?? "Expense not found" };
  }

  if (newStatus !== "pending" && expenseRow.status !== newStatus) {
    await supabaseAdmin.from("expenses").update({ status: newStatus }).eq("id", input.expenseId);

    const founder = founderById(input.founderId);
    await logAuditEvent({
      type: newStatus === "approved" ? "expense_approved" : "expense_rejected",
      description: `"${expenseRow.title}" was ${newStatus} by ${founder?.name ?? input.founderId}`,
      actor: founder?.name ?? input.founderId,
      details: {
        expenseId: input.expenseId,
        amount: Number(expenseRow.amount),
        currency: expenseRow.currency,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/history");

  return { success: true as const, status: newStatus, approveCount, rejectCount };
}
