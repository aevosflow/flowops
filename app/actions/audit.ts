"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { mapAuditEvent } from "@/lib/db-mappers";
import { AuditEvent } from "@/lib/types";

/**
 * Internal helper — every other Server Action calls this after a write
 * so the audit trail always stays in sync. Not exported as a public action
 * because "use server" files may only export async functions.
 */
export async function logAuditEvent(input: {
  type: AuditEvent["type"];
  description: string;
  actor: string;
  details?: Record<string, any>;
}) {
  const { error } = await supabaseAdmin.from("audit_events").insert({
    type: input.type,
    description: input.description,
    actor: input.actor,
    details: input.details ?? null,
  });
  if (error) {
    console.error("Failed to log audit event:", error.message);
  }
}

export async function getAuditEvents(type?: AuditEvent["type"][]) {
  let query = supabaseAdmin
    .from("audit_events")
    .select("*")
    .order("timestamp", { ascending: false });

  if (type && type.length > 0) {
    query = query.in("type", type);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getAuditEvents error:", error.message);
    return [];
  }
  return data.map(mapAuditEvent);
}
