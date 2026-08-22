"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/types/database";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <Card hover className="group h-full overflow-hidden p-0">
          <div className="relative aspect-video overflow-hidden bg-border/30">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted text-sm">
                No preview
              </div>
            )}
            {project.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="primary">Featured</Badge>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {project.short_description}
            </p>
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.technologies.slice(0, 4).map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
                {project.technologies.length > 4 && (
                  <Badge>+{project.technologies.length - 4}</Badge>
                )}
              </div>
            )}
            {(project.live_url || project.github_url) && (
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/40">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
