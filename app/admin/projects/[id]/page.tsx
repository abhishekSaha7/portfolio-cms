import { ProjectEditForm } from "@/components/admin/project-edit-form";
import { getProjectById } from "@/lib/data/projects";
import { notFound } from "next/navigation";

interface AdminProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectDetailPage({ params }: AdminProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Project</h2>
        <p className="text-muted-foreground mt-1">Update project information, cover photo, and screenshot gallery.</p>
      </div>
      <ProjectEditForm project={project} />
    </div>
  );
}
