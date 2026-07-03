import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ComplianceList } from "@/components/secrets/ComplianceList";
import { VaultActivityTable } from "@/components/secrets/VaultActivityTable";
import { SecretsVaultClient } from "@/components/secrets/SecretsVaultClient";
import { getSecrets, getVaultActivity } from "@/app/actions/secrets";
import { getCompliance } from "@/app/actions/compliance";

export default async function SecretsVaultPage() {
  const [secrets, compliance, vaultActivity] = await Promise.all([
    getSecrets(),
    getCompliance(),
    getVaultActivity(),
  ]);

  return (
    <AppShell title="Secrets Vault" subtitle="Manage and audit environment variables and API credentials.">
      <div className="space-y-6">
        <SecretsVaultClient secrets={secrets} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
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

          <ComplianceList items={compliance} />
        </div>

        <VaultActivityTable events={vaultActivity} />
      </div>
    </AppShell>
  );
}
