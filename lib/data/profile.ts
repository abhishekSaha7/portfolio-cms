import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function updateProfile(
  id: string,
  updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfileImage(id: string, imageUrl: string | null) {
  return updateProfile(id, { profile_image_url: imageUrl });
}
