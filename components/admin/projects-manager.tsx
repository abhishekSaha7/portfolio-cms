"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/utils/slug";
import type { Project } from "@/types/database";
import { ExternalLink, FolderOpen, Plus, Search, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProjectsManagerProps {
  projects: Project[];
}

export function ProjectsManager({ projects: initial }: ProjectsManagerProps) {
  const [projects, setProjects] = useState(initial);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "featured">("all");
  const [form, setForm] = useState({
    title: "", short_description: "", full_description: "",
    technologies: "", github_url: "", live_url: "", featured: false, published: false,
  });

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.published) ||
      (filter === "featured" && p.featured);
    return matchesSearch && matchesFilter;
  });

  const addProject = async () => {
    if (!form.title) return;
    try {
      const supabase = createClient();
      const slug = generateSlug(form.title);
      const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.display_order)) + 1 : 0;
      const { data, error } = await supabase.from("projects").insert({
        title: form.title,
        slug,
        short_description: form.short_description,
        full_description: form.full_description,
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        featured: form.featured,
        published: form.published,
        display_order: nextOrder,
      }).select().single();
      if (error) throw error;
      setProjects([...projects, data]);
      setForm({ title: "", short_description: "", full_description: "", technologies: "", github_url: "", live_url: "", featured: false, published: false });
      setShowForm(false);
      showToast("Project created");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to create project", "error");
    }
  };

  const toggleField = async (id: string, field: "published" | "featured", value: boolean) => {
    const supabase = createClient();
    await supabase.from("projects").update({ [field]: !value }).eq("id", id);
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: !value } : p)));
    await revalidatePortfolio();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    setProjects(projects.filter((p) => p.id !== id));
    showToast("Project deleted");
    await revalidatePortfolio();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input className="pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add Project</Button>
        </div>

        {showForm && (
          <Card>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
              <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
              <Input label="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
            <Textarea label="Short Description" className="mt-3" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
            <Textarea label="Full Description" className="mt-3" value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addProject}>Create Project</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        {filtered.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No projects found" description="Create your first project to get started." />
        ) : (
          <div className="space-y-3">
            {filtered.map((project) => (
              <Card key={project.id}>
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-border/30 shrink-0">
                    {project.thumbnail_url ? (
                      <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{project.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{project.short_description}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => toggleField(project.id, "published", project.published)}>
                        <Badge variant={project.published ? "success" : "default"}>{project.published ? "Published" : "Draft"}</Badge>
                      </button>
                      <button onClick={() => toggleField(project.id, "featured", project.featured)}>
                        <Badge variant={project.featured ? "primary" : "default"}><Star className="h-3 w-3 mr-1" />{project.featured ? "Featured" : "Standard"}</Badge>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.published && (
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                      </Link>
                    )}
                    <Link href={`/admin/projects/${project.id}`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    <button onClick={() => deleteProject(project.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
