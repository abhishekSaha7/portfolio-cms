import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/database";

export async function getExperience(admin = false): Promise<Experience[]> {
  const supabase = await createClient();
  let query = supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  if (!admin) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function createExperience(
  entry: Omit<Experience, "id" | "display_order" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("experience")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("experience")
    .insert({ ...entry, display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateExperience(
  id: string,
  updates: Partial<Omit<Experience, "id" | "created_at" | "updated_at">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderExperience(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("experience").update({ display_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}
