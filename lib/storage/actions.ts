"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadFile(
  bucket: "profile-images" | "project-images" | "resumes",
  file: File,
  path?: string
): Promise<string> {
  const supabase = await createClient();
  const fileName = path ?? `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) throw new Error(error.message);

  if (bucket === "resumes") {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteFile(
  bucket: "profile-images" | "project-images" | "resumes",
  url: string
) {
  const supabase = await createClient();
  const path = url.split(`/${bucket}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}

export async function getSignedResumeUrl(fileUrl: string): Promise<string> {
  const supabase = await createClient();
  const path = fileUrl.split("/resumes/")[1];
  if (!path) return fileUrl;

  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(path, 3600);

  if (error) return fileUrl;
  return data.signedUrl;
}
