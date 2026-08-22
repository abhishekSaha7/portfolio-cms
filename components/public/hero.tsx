"use client";

import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { AnimatedTitles } from "@/components/public/animated-titles";
import type { Profile } from "@/types/database";
import { FileText, FolderOpen } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  profile: Profile;
  titles: string[];
  resumeUrl?: string | null;
}

export function Hero({ profile, titles, resumeUrl }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="home" className="section-padding pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <SectionReveal>
            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {profile.greeting ?? "Hello, I'm"}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="gradient-text">{profile.full_name}</span>
              </h1>

              <div className="text-xl sm:text-2xl font-medium text-muted-foreground h-9">
                <AnimatedTitles titles={titles} />
              </div>

              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                {profile.hero_description ?? profile.bio}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/#projects">
                  <Button size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/25">
                    <FolderOpen className="h-4 w-4" />
                    View Projects
                  </Button>
                </Link>

                {resumeUrl ? (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                      <FileText className="h-4 w-4" />
                      View Resume
                    </Button>
                  </a>
                ) : (
                  <Link href="/resume">
                    <Button variant="secondary" size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                      <FileText className="h-4 w-4" />
                      View Resume
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="gradient-border rounded-2xl">
                  <div className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-2xl overflow-hidden bg-card">
                    {profile.profile_image_url ? (
                      <Image
                        src={profile.profile_image_url}
                        alt={`${profile.full_name} profile photo`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 288px, 384px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl font-bold text-border">
                        {profile.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
