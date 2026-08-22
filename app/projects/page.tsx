import { EmptyState } from "@/components/ui/empty-state";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { ProjectCard } from "@/components/public/project-card";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { getProfile } from "@/lib/data/profile";
import { getProjects } from "@/lib/data/projects";
import { FolderOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse projects by Abhisek Saha — React, Next.js, and TypeScript applications.",
};

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  if (!profile) return null;

  return (
    <>
      <Navbar name={profile.full_name} />
      <main className="pt-24 section-padding">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionReveal>
            <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
              Portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
              All Projects
            </h1>
          </SectionReveal>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="Projects will appear here once they are added and published through the admin dashboard."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
