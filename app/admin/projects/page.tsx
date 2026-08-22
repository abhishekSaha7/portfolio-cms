import { ProjectsManager } from "@/components/admin/projects-manager";
import { getProjects } from "@/lib/data/projects";

export default async function AdminProjectsPage() {
  const projects = await getProjects({ admin: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-muted-foreground mt-1">Create, edit, and manage your portfolio projects.</p>
      </div>
      <ProjectsManager projects={projects} />
    </div>
  );
}
