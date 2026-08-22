"use client";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import type { Resume } from "@/types/database";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ResumeManagerProps {
  resumes: Resume[];
}

export function ResumeManager({ resumes: initial }: ResumeManagerProps) {
  const [resumes, setResumes] = useState(initial);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileName = `resume-${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
      const { data, error } = await supabase.from("resume").insert({
        file_url: urlData.publicUrl,
        file_name: file.name,
        published: false,
      }).select().single();
      if (error) throw error;

      setResumes([data, ...resumes]);
      showToast("Resume uploaded");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to upload resume", "error");
    } finally {
      setUploading(false);
    }
  };

  const publishResume = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("resume").update({ published: false }).eq("published", true);
      await supabase.from("resume").update({ published: true }).eq("id", id);
      setResumes(resumes.map((r) => ({ ...r, published: r.id === id })));
      showToast("Resume published");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to publish resume", "error");
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    try {
      const supabase = createClient();
      await supabase.from("resume").delete().eq("id", id);
      setResumes(resumes.filter((r) => r.id !== id));
      showToast("Resume deleted");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to delete resume", "error");
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        <div>
          <Button onClick={() => fileRef.current?.click()} loading={uploading}>
            <Upload className="h-4 w-4" /> Upload Resume
          </Button>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={uploadResume} />
          <p className="text-xs text-muted-foreground mt-2">Accepted formats: PDF, DOC, DOCX</p>
        </div>

        {resumes.length === 0 ? (
          <EmptyState icon={FileText} title="No resume uploaded" description="Upload your resume to make it available for download." />
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <Card key={resume.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{resume.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resume.published ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => publishResume(resume.id)}>Publish</Button>
                    )}
                    <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </a>
                    <button onClick={() => deleteResume(resume.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
