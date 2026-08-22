import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/types/database";

export async function getSkills(admin = false): Promise<Skill[]> {
  const supabase = await createClient();
  let query = supabase
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true });

  if (!admin) {
    query = query.eq("enabled", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function createSkill(name: string, enabled = true) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("skills")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("skills")
    .insert({ name, enabled, display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSkill(
  id: string,
  updates: Partial<Pick<Skill, "name" | "enabled" | "display_order">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderSkills(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("skills").update({ display_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}
