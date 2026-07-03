import { AppShell } from "@/components/layout/AppShell";
import { getProjects } from "@/app/actions/projects";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <AppShell title="Projects" subtitle="Client project cost attribution and margin analytics">
      <ProjectsClient initialProjects={projects} />
    </AppShell>
  );
}
