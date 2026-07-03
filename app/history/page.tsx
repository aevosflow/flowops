import { AppShell } from "@/components/layout/AppShell";
import { HistoryClient } from "@/components/history/HistoryClient";
import { getAuditEvents } from "@/app/actions/audit";

export default async function HistoryPage() {
  const events = await getAuditEvents();

  return (
    <AppShell title="History" subtitle="Immutable monthly and audit records">
      <HistoryClient events={events} />
    </AppShell>
  );
}
