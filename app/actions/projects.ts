"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { mapProject } from "@/lib/db-mappers";
import { logAuditEvent } from "./audit";

export async function getProjects() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("getProjects error:", error.message);
    return [];
  }
  return data.map(mapProject);
}

export async function createProject(input: {
  name: string;
  client: string;
  budget: number;
  currency: string;
  status: "active" | "completed" | "on-hold";
}) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      client: input.client,
      budget: input.budget,
      currency: input.currency,
      status: input.status,
      spent: 0,
      margin: 0,
    })
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  await logAuditEvent({
    type: "project_created",
    description: `Project "${input.name}" created for ${input.client}`,
    actor: "SYSTEM",
    details: { projectId: data.id, budget: input.budget, currency: input.currency },
  });

  revalidatePath("/projects");
  revalidatePath("/history");

  return { success: true as const, project: mapProject(data) };
}

export async function updateProject(input: {
  id: string;
  name?: string;
  client?: string;
  budget?: number;
  spent?: number;
  currency?: string;
  status?: "active" | "completed" | "on-hold";
  margin?: number;
  endDate?: string;
}) {
  const updates: Record<string, any> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.client !== undefined) updates.client = input.client;
  if (input.budget !== undefined) updates.budget = input.budget;
  if (input.spent !== undefined) updates.spent = input.spent;
  if (input.currency !== undefined) updates.currency = input.currency;
  if (input.status !== undefined) updates.status = input.status;
  if (input.margin !== undefined) updates.margin = input.margin;
  if (input.endDate !== undefined) updates.end_date = input.endDate;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(updates)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  await logAuditEvent({
    type: "project_updated",
    description: `Project "${data.name}" was updated`,
    actor: "SYSTEM",
    details: { projectId: data.id, ...updates },
  });

  revalidatePath("/projects");
  revalidatePath("/history");

  return { success: true as const, project: mapProject(data) };
}
