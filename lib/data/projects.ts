import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectWithImages, ProjectImage } from "@/types/database";

export async function getProjects(options?: {
  admin?: boolean;
  featured?: boolean;
  published?: boolean;
}): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (!options?.admin) {
    query = query.eq("published", true);
  } else if (options.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data as ProjectWithImages;
}

export async function getProjectById(id: string): Promise<ProjectWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ProjectWithImages;
}

export async function createProject(
  project: Omit<Project, "id" | "display_order" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...project, display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderProjects(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("projects").update({ display_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  altText?: string
): Promise<ProjectImage> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("project_images")
    .select("display_order")
    .eq("project_id", projectId)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from("project_images")
    .insert({
      project_id: projectId,
      image_url: imageUrl,
      alt_text: altText,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProjectImage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("project_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getProjectCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getFeaturedProjectCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);
  return count ?? 0;
}
