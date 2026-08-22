import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { getProfile } from "@/lib/data/profile";
import { getProjectBySlug } from "@/lib/data/projects";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [profile, project] = await Promise.all([getProfile(), getProjectBySlug(slug)]);

  if (!profile || !project) notFound();

  const images = project.project_images?.sort((a, b) => a.display_order - b.display_order) ?? [];

  return (
    <>
      <Navbar name={profile.full_name} />
      <main className="pt-24">
        {project.thumbnail_url && (
          <div className="relative aspect-[21/9] max-h-[480px] overflow-hidden bg-border/30">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 sm:px-6 section-padding !pt-10">
          <SectionReveal>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
            >
              ← Back to projects
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {project.short_description}
            </p>

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="primary">{tech}</Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-10">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary">
                    <GithubIcon className="h-4 w-4" /> View Code
                  </Button>
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <Button>
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </Button>
                </a>
              )}
            </div>

            {project.full_description && (
              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.full_description}
                </p>
              </div>
            )}

            {images.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Screenshots</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-video rounded-xl overflow-hidden border border-border bg-border/30"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt_text ?? project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionReveal>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
