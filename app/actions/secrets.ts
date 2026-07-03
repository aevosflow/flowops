"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { mapSecret } from "@/lib/db-mappers";
import { Secret } from "@/lib/types";
import { logAuditEvent } from "./audit";

function maskValue(value: string) {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}${"•".repeat(Math.max(4, value.length - 8))}${value.slice(-4)}`;
}

function generateSecretValue() {
  return randomBytes(24).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
}

async function logVaultActivity(input: {
  event: "REVEAL_VALUE" | "ROTATE_CREDENTIALS" | "UNAUTHORIZED_ACCESS" | "SECRET_CREATED";
  secretName: string;
  userLabel: string;
  status: "success" | "blocked" | "warning";
}) {
  const { error } = await supabaseAdmin.from("vault_activity").insert({
    event: input.event,
    secret_name: input.secretName,
    user_label: input.userLabel,
    status: input.status,
  });
  if (error) console.error("logVaultActivity error:", error.message);
}

export async function getSecrets() {
  const { data, error } = await supabaseAdmin
    .from("secrets")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSecrets error:", error.message);
    return [];
  }
  return data.map(mapSecret);
}

export async function getVaultActivity() {
  const { data, error } = await supabaseAdmin
    .from("vault_activity")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getVaultActivity error:", error.message);
    return [];
  }
  const { mapVaultActivity } = await import("@/lib/db-mappers");
  return data.map(mapVaultActivity);
}

export async function createSecret(input: {
  environment: Secret["environment"];
  name: string;
  value: string;
  actor?: string;
}) {
  const actor = input.actor ?? "SYSTEM";
  const { data, error } = await supabaseAdmin
    .from("secrets")
    .insert({
      environment: input.environment,
      name: input.name,
      revealed_value: input.value,
      masked_value: maskValue(input.value),
      status: "secure",
    })
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  await logAuditEvent({
    type: "secret_created",
    description: `Secret "${input.name}" created in ${input.environment}`,
    actor,
    details: { secretId: data.id, environment: input.environment },
  });
  await logVaultActivity({
    event: "SECRET_CREATED",
    secretName: input.name,
    userLabel: actor,
    status: "success",
  });

  revalidatePath("/secrets-vault");
  revalidatePath("/history");

  return { success: true as const, secret: mapSecret(data) };
}

export async function revealSecret(input: { id: string; actor?: string }) {
  const actor = input.actor ?? "SYSTEM";
  const { data, error } = await supabaseAdmin
    .from("secrets")
    .select("*")
    .eq("id", input.id)
    .single();

  if (error || !data) {
    return { success: false as const, error: error?.message ?? "Secret not found" };
  }

  await logAuditEvent({
    type: "secret_accessed",
    description: `Secret "${data.name}" was revealed`,
    actor,
    details: { secretId: data.id, environment: data.environment },
  });
  await logVaultActivity({
    event: "REVEAL_VALUE",
    secretName: data.name,
    userLabel: actor,
    status: "success",
  });

  revalidatePath("/secrets-vault");
  revalidatePath("/history");

  return { success: true as const, value: data.revealed_value };
}

export async function rotateSecret(input: { id: string; actor?: string }) {
  const actor = input.actor ?? "SYSTEM";
  const newValue = generateSecretValue();

  const { data, error } = await supabaseAdmin
    .from("secrets")
    .update({
      revealed_value: newValue,
      masked_value: maskValue(newValue),
      status: "secure",
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error || !data) {
    return { success: false as const, error: error?.message ?? "Secret not found" };
  }

  await logAuditEvent({
    type: "secret_rotated",
    description: `Credentials for "${data.name}" were rotated`,
    actor,
    details: { secretId: data.id, environment: data.environment },
  });
  await logVaultActivity({
    event: "ROTATE_CREDENTIALS",
    secretName: data.name,
    userLabel: actor,
    status: "success",
  });

  revalidatePath("/secrets-vault");
  revalidatePath("/history");

  return { success: true as const, secret: mapSecret(data) };
}
