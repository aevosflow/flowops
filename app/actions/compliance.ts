"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { mapCompliance } from "@/lib/db-mappers";
import { logAuditEvent } from "./audit";

export async function getCompliance() {
  const { data, error } = await supabaseAdmin.from("compliance_items").select("*").order("label");

  if (error) {
    console.error("getCompliance error:", error.message);
    return [];
  }
  return data.map(mapCompliance);
}

export async function toggleCompliance(input: { id: string; actor?: string }) {
  const actor = input.actor ?? "SYSTEM";

  const { data: current, error: fetchError } = await supabaseAdmin
    .from("compliance_items")
    .select("*")
    .eq("id", input.id)
    .single();

  if (fetchError || !current) {
    return { success: false as const, error: fetchError?.message ?? "Item not found" };
  }

  const { data, error } = await supabaseAdmin
    .from("compliance_items")
    .update({ enabled: !current.enabled })
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  await logAuditEvent({
    type: "compliance_change",
    description: `"${data.label}" was ${data.enabled ? "enabled" : "disabled"}`,
    actor,
    details: { complianceId: data.id, enabled: data.enabled },
  });

  revalidatePath("/secrets-vault");
  revalidatePath("/history");

  return { success: true as const, item: mapCompliance(data) };
}
