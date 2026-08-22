"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import type { ProjectWithImages } from "@/types/database";
import { ArrowLeft, ExternalLink, ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface ProjectEditFormProps {
  project: ProjectWithImages;
}

export function ProjectEditForm({ project: initial }: ProjectEditFormProps) {
  const router = useRouter();
  const [project, setProject] = useState(initial);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: project.title,
    slug: project.slug,
    short_description: project.short_description,
    full_description: project.full_description,
    technologies: project.technologies.join(", "),
    github_url: project.github_url ?? "",
    live_url: project.live_url ?? "",
    featured: project.featured,
    published: project.published,
  });

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const techArray = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { data, error } = await supabase
        .from("projects")
        .update({
          title: form.title,
          slug: form.slug,
          short_description: form.short_description,
          full_description: form.full_description,
          technologies: techArray,
          github_url: form.github_url || null,
          live_url: form.live_url || null,
          featured: form.featured,
          published: form.published,
        })
        .eq("id", project.id)
        .select("*, project_images(*)")
        .single();

      if (error) throw error;

      setProject(data as ProjectWithImages);
      showToast("Project details saved successfully");
      await revalidatePortfolio();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save project";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const supabase = createClient();
      const fileName = `thumb-${project.id}-${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadErr } = await supabase.storage
        .from("project-images")
        .upload(fileName, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName);

      const { data, error } = await supabase
        .from("projects")
        .update({ thumbnail_url: urlData.publicUrl })
        .eq("id", project.id)
        .select("*, project_images(*)")
        .single();

      if (error) throw error;

      setProject(data as ProjectWithImages);
      showToast("Thumbnail updated successfully");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to upload thumbnail", "error");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const supabase = createClient();
      const existingImages = project.project_images ?? [];
      let currentOrder = existingImages.length > 0
        ? Math.max(...existingImages.map((i) => i.display_order)) + 1
        : 0;

      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `gallery-${project.id}-${Date.now()}-${i}.${file.name.split(".").pop()}`;
        const { error: uploadErr } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);

        if (uploadErr) continue;

        const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName);
        const { data: imgData } = await supabase
          .from("project_images")
          .insert({
            project_id: project.id,
            image_url: urlData.publicUrl,
            alt_text: `${project.title} screenshot`,
            display_order: currentOrder++,
          })
          .select()
          .single();

        if (imgData) newImages.push(imgData);
      }

      setProject({
        ...project,
        project_images: [...(project.project_images ?? []), ...newImages],
      });
      showToast(`${newImages.length} screenshot(s) uploaded`);
      await revalidatePortfolio();
    } catch {
      showToast("Failed to upload screenshots", "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const deleteGalleryImage = async (imageId: string) => {
    if (!confirm("Delete this screenshot?")) return;
    try {
      const supabase = createClient();
      await supabase.from("project_images").delete().eq("id", imageId);
      setProject({
        ...project,
        project_images: (project.project_images ?? []).filter((img) => img.id !== imageId),
      });
      showToast("Screenshot deleted");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to delete screenshot", "error");
    }
  };

  return (
    <>
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          {project.published && (
            <Link href={`/projects/${project.slug}`} target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" /> View Live Page
              </Button>
            </Link>
          )}
        </div>

        <Card className="p-6">
          <form onSubmit={saveProject} className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-border pb-3">Project Overview</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Project Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                label="URL Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Short Description (Card summary)"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              rows={2}
            />

            <Textarea
              label="Full Description (Detail page markdown / text)"
              value={form.full_description}
              onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              rows={6}
            />

            <Input
              label="Technologies (Comma-separated: e.g. React, Next.js, Tailwind)"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/..."
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              />
              <Input
                label="Live Demo URL"
                placeholder="https://..."
                value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured Project
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Published (Visible on Portfolio)
              </label>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Thumbnail Image Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold border-b border-border pb-3 mb-4">Project Cover Thumbnail</h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative aspect-video w-full sm:w-64 rounded-xl overflow-hidden bg-border/30 border border-border">
              {project.thumbnail_url ? (
                <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted">No thumbnail</div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                This image is displayed on project cards and at the top of the project detail page.
              </p>
              <input ref={thumbnailRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
              <Button type="button" variant="secondary" size="sm" onClick={() => thumbnailRef.current?.click()} loading={uploadingThumbnail}>
                <Upload className="h-4 w-4" /> Upload Cover Image
              </Button>
            </div>
          </div>
        </Card>

        {/* Screenshots Gallery Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
            <div>
              <h3 className="text-lg font-semibold">Screenshots Gallery</h3>
              <p className="text-xs text-muted-foreground">Add detailed screenshots for the project page.</p>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
            <Button type="button" variant="secondary" size="sm" onClick={() => galleryRef.current?.click()} loading={uploadingGallery}>
              <ImagePlus className="h-4 w-4" /> Add Screenshots
            </Button>
          </div>

          {!project.project_images || project.project_images.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No additional screenshots added yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {project.project_images.map((img) => (
                <div key={img.id} className="group relative aspect-video rounded-lg overflow-hidden border border-border bg-border/30">
                  <Image src={img.image_url} alt={img.alt_text ?? "Screenshot"} fill className="object-cover" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteGalleryImage(img.id)}
                      className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      title="Delete screenshot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
