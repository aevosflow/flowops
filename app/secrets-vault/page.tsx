import { RotateCw, Plus, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { SecretCard } from "@/components/secrets/SecretCard";
import { ComplianceList } from "@/components/secrets/ComplianceList";
import { VaultActivityTable } from "@/components/secrets/VaultActivityTable";
import { SECRETS, COMPLIANCE_ITEMS, VAULT_ACTIVITY } from "@/lib/mock-data";

export default function SecretsVaultPage() {
  return (
    <AppShell title="Secrets Vault" subtitle="Manage and audit environment variables and API credentials.">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Encrypted Environment
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // In production, this would trigger a modal to confirm key rotation
                console.log("Rotating all keys...");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" /> Rotate Keys
            </button>
            <button
              onClick={() => {
                // In production, this would open a modal to create a new secret
                console.log("Creating new secret...");
              }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> New Secret
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {SECRETS.length === 0 ? (
              <Card className="p-8 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
                <p className="font-display text-sm font-semibold text-zinc-200">No secrets yet</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Environment variables and API credentials will be managed here.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SECRETS.map((s) => (
                  <SecretCard key={s.id} secret={s} />
                ))}
              </div>
            )}

            <Card className="p-4 sm:p-5">
              <h3 className="font-display text-sm font-semibold text-zinc-100">
                Access Entropy Map
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Visualizing unauthorized access attempts across distributed vault nodes.
              </p>
              <div className="mt-4 grid grid-cols-3 divide-x divide-zinc-800 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Uptime</p>
                  <p className="fig mt-1 text-lg font-semibold text-emerald-400">99.999%</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Last Audit</p>
                  <p className="fig mt-1 text-lg font-semibold text-zinc-100">2m ago</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Nodes</p>
                  <p className="fig mt-1 text-lg font-semibold text-zinc-100">12</p>
                </div>
              </div>
            </Card>
          </div>

          <ComplianceList items={COMPLIANCE_ITEMS} />
        </div>

        <VaultActivityTable events={VAULT_ACTIVITY} />
      </div>
    </AppShell>
  );
}
