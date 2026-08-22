import { getProfile } from "./profile";
import { getProjectCount, getFeaturedProjectCount } from "./projects";
import { getSkills } from "./skills";
import { isResumePublished } from "./resume";
import type { DashboardStats } from "@/types/database";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [profile, projectCount, featuredCount, skills, resumePublished] =
    await Promise.all([
      getProfile(),
      getProjectCount(),
      getFeaturedProjectCount(),
      getSkills(true),
      isResumePublished(),
    ]);

  let profileCompletion = 0;
  if (profile) {
    const fields = [
      profile.full_name,
      profile.professional_title,
      profile.bio,
      profile.email,
      profile.phone,
      profile.github_url,
      profile.linkedin_url,
      profile.profile_image_url,
    ];
    const filled = fields.filter(Boolean).length;
    profileCompletion = Math.round((filled / fields.length) * 100);
  }

  return {
    projectCount,
    featuredCount,
    skillsCount: skills.length,
    resumePublished,
    profileCompletion,
  };
}
