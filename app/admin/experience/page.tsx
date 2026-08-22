import { ExperienceManager } from "@/components/admin/experience-manager";
import { getExperience } from "@/lib/data/experience";

export default async function AdminExperiencePage() {
  const experience = await getExperience(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Experience</h2>
        <p className="text-muted-foreground mt-1">Manage your professional work experience.</p>
      </div>
      <ExperienceManager experience={experience} />
    </div>
  );
}
