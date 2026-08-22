import { createClient } from "@/lib/supabase/server";
import type { HeroTitle } from "@/types/database";

export async function getHeroTitles(admin = false): Promise<HeroTitle[]> {
  const supabase = await createClient();
  let query = supabase
    .from("hero_titles")
    .select("*")
    .order("display_order", { ascending: true });

  if (!admin) {
    query = query.eq("enabled", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function createHeroTitle(title: string, enabled = true) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("hero_titles")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("hero_titles")
    .insert({ title, enabled, display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateHeroTitle(
  id: string,
  updates: Partial<Pick<HeroTitle, "title" | "enabled" | "display_order">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_titles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteHeroTitle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_titles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderHeroTitles(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("hero_titles").update({ display_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}
