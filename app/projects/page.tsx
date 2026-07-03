import { FolderKanban } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function ProjectsPage() {
  return (
    <AppShell title="Projects" subtitle="Client project cost attribution and margin analytics">
      <Card className="flex flex-col items-center gap-3 p-12 text-center">
        <FolderKanban className="h-8 w-8 text-zinc-600" />
        <p className="font-display text-sm font-semibold text-zinc-200">
          Project cost attribution is next in line
        </p>
        <p className="max-w-sm text-xs text-zinc-500">
          This module will map client contracts against project-specific expenses,
          compute/API usage, and margin analytics per PRD Section 3.4.
        </p>
      </Card>
    </AppShell>
  );
}
