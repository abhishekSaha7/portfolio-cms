import { AboutSection } from "@/components/public/about-section";
import { ContactSection } from "@/components/public/contact-section";
import { EducationSection } from "@/components/public/education-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { Footer } from "@/components/public/footer";
import { Hero } from "@/components/public/hero";
import { Navbar } from "@/components/public/navbar";
import { ResumeCTA } from "@/components/public/resume-cta";
import { SkillsSection } from "@/components/public/skills-section";
import { getEducation } from "@/lib/data/education";
import { getExperience } from "@/lib/data/experience";
import { getHeroTitles } from "@/lib/data/hero";
import { getProfile } from "@/lib/data/profile";
import { getProjects } from "@/lib/data/projects";
import { getPublishedResume } from "@/lib/data/resume";
import { getSkills } from "@/lib/data/skills";

export default async function HomePage() {
  const [profile, titles, skills, education, experience, featuredProjects, resume] =
    await Promise.all([
      getProfile(),
      getHeroTitles(),
      getSkills(),
      getEducation(),
      getExperience(),
      getProjects({ featured: true }),
      getPublishedResume(),
    ]);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Portfolio content is being set up...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar name={profile.full_name} />
      <main>
        <Hero profile={profile} titles={titles.map((t) => t.title)} resumeUrl={resume?.file_url} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <FeaturedProjects projects={featuredProjects} />
        <ResumeCTA resumeUrl={resume?.file_url} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
