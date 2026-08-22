import { createClient } from "@/lib/supabase/server";
import type { Resume } from "@/types/database";

export async function getPublishedResume(): Promise<Resume | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume")
    .select("*")
    .eq("published", true)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function getAllResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function uploadResume(fileUrl: string, fileName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume")
    .insert({ file_url: fileUrl, file_name: fileName, published: false })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function publishResume(id: string) {
  const supabase = await createClient();
  await supabase.from("resume").update({ published: false }).eq("published", true);
  const { data, error } = await supabase
    .from("resume")
    .update({ published: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteResume(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("resume").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function isResumePublished(): Promise<boolean> {
  const resume = await getPublishedResume();
  return resume !== null;
}
