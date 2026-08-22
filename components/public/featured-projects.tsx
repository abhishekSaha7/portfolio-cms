import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { ProjectCard } from "@/components/public/project-card";
import type { Project } from "@/types/database";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section id="projects" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
                Projects
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Featured work
              </h2>
            </div>
            <Link href="/projects" className="hidden sm:block">
              <Button variant="ghost">View all →</Button>
            </Link>
          </div>
        </SectionReveal>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Projects will appear here once they are added and published."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/projects">
            <Button variant="secondary">View all projects</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
