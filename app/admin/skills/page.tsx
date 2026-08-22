import { SkillsManager } from "@/components/admin/skills-manager";
import { getSkills } from "@/lib/data/skills";

export default async function AdminSkillsPage() {
  const skills = await getSkills(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-muted-foreground mt-1">Manage the technologies and skills displayed on your portfolio.</p>
      </div>
      <SkillsManager skills={skills} />
    </div>
  );
}
