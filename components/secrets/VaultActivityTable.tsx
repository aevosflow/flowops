import { Card } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { VaultActivityEvent } from "@/lib/types";

export function VaultActivityTable({ events }: { events: VaultActivityEvent[] }) {
  return (
    <Card>
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <h3 className="font-display text-sm font-semibold text-zinc-100">Vault Activity</h3>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-2.5 font-medium">Event</th>
              <th className="px-5 py-2.5 font-medium">Secret</th>
              <th className="px-5 py-2.5 font-medium">User</th>
              <th className="px-5 py-2.5 font-medium">Timestamp</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-zinc-800/60">
                <td className="fig px-5 py-3 text-emerald-400">{e.event}</td>
                <td className="fig px-5 py-3 text-zinc-300">{e.secretName}</td>
                <td className="px-5 py-3 text-zinc-400">{e.userLabel}</td>
                <td className="fig px-5 py-3 text-zinc-500">
                  {formatDateTime(e.timestamp)}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <ul className="divide-y divide-zinc-800/60 sm:hidden">
        {events.map((e) => (
          <li key={e.id} className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="fig text-xs font-semibold text-emerald-400">{e.event}</span>
              <Badge tone={statusTone(e.status)}>{e.status}</Badge>
            </div>
            <p className="fig text-xs text-zinc-300">{e.secretName}</p>
            <p className="mt-1 text-[11px] text-zinc-500">
              {e.userLabel} • {formatDateTime(e.timestamp)}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
