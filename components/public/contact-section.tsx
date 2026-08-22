import { SectionReveal } from "@/components/ui/motion-wrapper";
import type { Profile } from "@/types/database";
import { Mail, MapPin, Phone } from "lucide-react";

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section id="contact" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Get in touch
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg">
            Have a question or want to work together? Feel free to reach out.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors min-w-0"
              >
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground truncate break-all sm:break-normal">{profile.email}</p>
                </div>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors min-w-0"
              >
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground truncate">{profile.phone}</p>
                </div>
              </a>
            )}
            {profile.location && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 min-w-0">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm text-foreground truncate">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
