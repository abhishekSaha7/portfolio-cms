import { ResumeManager } from "@/components/admin/resume-manager";
import { getAllResumes } from "@/lib/data/resume";

export default async function AdminResumePage() {
  const resumes = await getAllResumes();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Resume</h2>
        <p className="text-muted-foreground mt-1">Upload and manage your CV / Resume files.</p>
      </div>
      <ResumeManager resumes={resumes} />
    </div>
  );
}
