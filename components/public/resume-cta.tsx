import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

interface ResumeCTAProps {
  resumeUrl?: string | null;
}

export function ResumeCTA({ resumeUrl }: ResumeCTAProps) {
  return (
    <section className="section-padding bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
            <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Interested in my background?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Download my resume to learn more about my skills, education, and experience.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download>
                  <Button size="lg">
                    <Download className="h-4 w-4" />
                    Download Resume
                  </Button>
                </a>
              ) : (
                <Link href="/resume">
                  <Button variant="secondary" size="lg">
                    View Resume Page
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
