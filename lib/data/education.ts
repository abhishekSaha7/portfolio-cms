import { createClient } from "@/lib/supabase/server";
import type { Education } from "@/types/database";

export async function getEducation(admin = false): Promise<Education[]> {
  const supabase = await createClient();
  let query = supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true });

  if (!admin) {
    query = query.eq("enabled", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function createEducation(
  entry: Omit<Education, "id" | "display_order" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("education")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("education")
    .insert({ ...entry, display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateEducation(
  id: string,
  updates: Partial<Omit<Education, "id" | "created_at" | "updated_at">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderEducation(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("education").update({ display_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}
