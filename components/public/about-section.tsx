import { SectionReveal } from "@/components/ui/motion-wrapper";
import type { Profile } from "@/types/database";
import { MapPin } from "lucide-react";

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              {profile.professional_title}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              {profile.bio}
            </p>
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
