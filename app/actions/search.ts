"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface SearchResult {
  id: string;
  kind: "expense" | "project" | "secret";
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const [expenses, projects, secrets] = await Promise.all([
    supabaseAdmin
      .from("expenses")
      .select("id,title,category,amount,currency")
      .is("deleted_at", null)
      .ilike("title", `%${q}%`)
      .limit(5),
    supabaseAdmin
      .from("projects")
      .select("id,name,client")
      .is("deleted_at", null)
      .or(`name.ilike.%${q}%,client.ilike.%${q}%`)
      .limit(5),
    supabaseAdmin
      .from("secrets")
      .select("id,name,environment")
      .is("deleted_at", null)
      .ilike("name", `%${q}%`)
      .limit(5),
  ]);

  const results: SearchResult[] = [];

  (expenses.data ?? []).forEach((e) =>
    results.push({
      id: e.id,
      kind: "expense",
      title: e.title,
      subtitle: `${e.category} • ${e.currency} ${e.amount}`,
      href: "/expenses",
    })
  );

  (projects.data ?? []).forEach((p) =>
    results.push({
      id: p.id,
      kind: "project",
      title: p.name,
      subtitle: p.client,
      href: "/projects",
    })
  );

  (secrets.data ?? []).forEach((s) =>
    results.push({
      id: s.id,
      kind: "secret",
      title: s.name,
      subtitle: s.environment,
      href: "/secrets-vault",
    })
  );

  return results;
}
