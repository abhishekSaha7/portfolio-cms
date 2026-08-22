import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { Card } from "@/components/ui/card";
import type { Education } from "@/types/database";
import { GraduationCap } from "lucide-react";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Education
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            Academic background
          </h2>
        </SectionReveal>

        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {education.map((item) => (
            <StaggerItem key={item.id}>
              <Card hover className="h-full">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.degree}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.institution}</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted">
                      {item.year && <span>{item.year}</span>}
                      {item.marks && <span>{item.marks}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
