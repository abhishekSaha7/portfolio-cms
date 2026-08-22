import type { Profile } from "@/types/database";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/20 pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-border/60">
          {/* Column 1: Brand & Intro */}
          <div className="space-y-4 lg:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              {profile.full_name}
              <span className="text-primary">.</span>
            </Link>
            <p className="text-xs font-medium text-primary tracking-wide uppercase">
              {profile.professional_title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Building modern, responsive web experiences with React, Next.js & TypeScript.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#home" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="hover:text-foreground transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-foreground transition-colors">
                  Resume
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact Info
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {profile.email && (
                <li className="flex items-center gap-2 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-foreground transition-colors truncate"
                  >
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && (
                <li className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <a
                    href={`tel:${profile.phone}`}
                    className="hover:text-foreground transition-colors truncate"
                  >
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile.location && (
                <li className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Resume CTA */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Work Together
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interested in collaborating or hiring for frontend roles?
            </p>
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors pt-1"
            >
              View My Resume <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-muted-foreground">
          <p>© {year} {profile.full_name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Built with React, Next.js & Tailwind CSS</span>
            <Link
              href="/admin/login"
              className="text-muted hover:text-muted-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
