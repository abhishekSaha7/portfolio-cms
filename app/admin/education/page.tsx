import { EducationManager } from "@/components/admin/education-manager";
import { getEducation } from "@/lib/data/education";

export default async function AdminEducationPage() {
  const education = await getEducation(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Education</h2>
        <p className="text-muted-foreground mt-1">Manage your academic background and qualifications.</p>
      </div>
      <EducationManager education={education} />
    </div>
  );
}
