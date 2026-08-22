import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { SectionReveal } from "@/components/ui/motion-wrapper";
import { getProfile } from "@/lib/data/profile";
import { getPublishedResume } from "@/lib/data/resume";
import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download Abhisek Saha's resume — Front End Developer.",
};

export default async function ResumePage() {
  const [profile, resume] = await Promise.all([getProfile(), getPublishedResume()]);

  if (!profile) return null;

  return (
    <>
      <Navbar name={profile.full_name} />
      <main className="pt-24 section-padding">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <SectionReveal>
            <div className="mx-auto mb-6 rounded-full bg-primary/10 p-5 w-fit">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Resume
            </h1>
            <p className="text-muted-foreground mb-8">
              Download my latest resume to learn more about my background and skills.
            </p>

            {resume ? (
              <div className="flex flex-wrap justify-center gap-4">
                <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/25">
                    <FileText className="h-5 w-5" />
                    View Resume PDF
                  </Button>
                </a>
                <a href={resume.file_url} target="_blank" rel="noopener noreferrer" download="Abhishek-Saha-Resume.pdf">
                  <Button variant="secondary" size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                    <Download className="h-5 w-5" />
                    Download Resume
                  </Button>
                </a>
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="Resume not available"
                description="A resume has not been uploaded yet. Check back soon."
              />
            )}
          </SectionReveal>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
