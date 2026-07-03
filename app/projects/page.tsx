"use client";

import { FolderKanban, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { PROJECTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ProjectsPage() {
  const projectCount = PROJECTS.length;
  const totalBudget = PROJECTS.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = PROJECTS.reduce((sum, p) => sum + p.spent, 0);
  const avgMargin = projectCount > 0 ? Math.round(PROJECTS.reduce((sum, p) => sum + p.margin, 0) / projectCount) : 0;

  return (
    <AppShell title="Projects" subtitle="Client project cost attribution and margin analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Active Projects</p>
            <p className="mt-2 font-display text-2xl font-semibold text-zinc-100">{projectCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Budget</p>
            <p className="mt-2 font-display text-2xl font-semibold text-zinc-100">{formatCurrency(totalBudget)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Spent</p>
            <p className="mt-2 font-display text-2xl font-semibold text-zinc-100">{formatCurrency(totalSpent)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Avg Margin</p>
            <p className="mt-2 font-display text-2xl font-semibold text-emerald-400">{avgMargin}%</p>
          </Card>
        </div>

        {/* Projects List or Empty State */}
        {projectCount === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <FolderKanban className="h-8 w-8 text-zinc-600" />
            <p className="font-display text-sm font-semibold text-zinc-200">No projects yet</p>
            <p className="max-w-sm text-xs text-zinc-500">
              Project cost attribution will map client contracts against project-specific expenses, compute/API usage,
              and margin analytics per PRD Section 3.4.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400">
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {PROJECTS.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-zinc-100">{project.name}</p>
                    <p className="text-xs text-zinc-500">{project.client}</p>
                  </div>
                  <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">{project.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Budget</p>
                    <p className="font-semibold text-zinc-100">{formatCurrency(project.budget, project.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Spent</p>
                    <p className="font-semibold text-zinc-100">{formatCurrency(project.spent, project.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Margin</p>
                    <p className="font-semibold text-emerald-400">{project.margin}%</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
