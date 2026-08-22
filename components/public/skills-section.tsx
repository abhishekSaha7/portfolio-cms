import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import type { Skill } from "@/types/database";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="section-padding bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            Technologies I work with
          </h2>
        </SectionReveal>

        <StaggerContainer className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <StaggerItem key={skill.id}>
              <div className="group relative">
                <div className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/5">
                  {skill.name}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
