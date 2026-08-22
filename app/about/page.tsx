import { AboutSection } from "@/components/public/about-section";
import { EducationSection } from "@/components/public/education-section";
import { ExperienceSection } from "@/components/public/experience-section";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getEducation } from "@/lib/data/education";
import { getExperience } from "@/lib/data/experience";
import { getProfile } from "@/lib/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Abhisek Saha — Front End Developer from Kolkata.",
};

export default async function AboutPage() {
  const [profile, education, experience] = await Promise.all([
    getProfile(),
    getEducation(),
    getExperience(),
  ]);

  if (!profile) return null;

  return (
    <>
      <Navbar name={profile.full_name} />
      <main className="pt-24">
        <AboutSection profile={profile} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
