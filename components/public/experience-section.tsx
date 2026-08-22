import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import type { Experience } from "@/types/database";
import { Briefcase } from "lucide-react";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            Work experience
          </h2>
        </SectionReveal>

        {experience.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No experience added yet"
            description="Professional experience will appear here once added."
          />
        ) : (
          <StaggerContainer className="space-y-4">
            {experience.map((item) => (
              <StaggerItem key={item.id}>
                <Card hover>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.role}</h3>
                      <p className="text-sm text-primary mt-0.5">{item.company}</p>
                      {item.location && (
                        <p className="text-xs text-muted mt-1">{item.location}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground shrink-0">
                      {item.start_date}
                      {" — "}
                      {item.currently_working ? "Present" : item.end_date}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="primary">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
