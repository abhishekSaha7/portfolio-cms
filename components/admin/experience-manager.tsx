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
import type { Experience } from "@/types/database";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExperienceManagerProps {
  experience: Experience[];
}

export function ExperienceManager({ experience: initial }: ExperienceManagerProps) {
  const [items, setItems] = useState(initial);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: "", role: "", start_date: "", end_date: "", description: "",
    technologies: "", location: "", currently_working: false, published: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const addItem = async () => {
    if (!form.company || !form.role || !form.start_date) return;
    try {
      const supabase = createClient();
      const nextOrder = items.length > 0 ? Math.max(...items.map((e) => e.display_order)) + 1 : 0;
      const { data, error } = await supabase.from("experience").insert({
        company: form.company,
        role: form.role,
        start_date: form.start_date,
        end_date: form.currently_working ? null : form.end_date || null,
        description: form.description || null,
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        location: form.location || null,
        currently_working: form.currently_working,
        published: form.published,
        display_order: nextOrder,
      }).select().single();
      if (error) throw error;
      setItems([...items, data]);
      setForm({ company: "", role: "", start_date: "", end_date: "", description: "", technologies: "", location: "", currently_working: false, published: true });
      setShowForm(false);
      showToast("Experience added");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to add experience", "error");
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    const supabase = createClient();
    await supabase.from("experience").update({ published: !published }).eq("id", id);
    setItems(items.map((e) => (e.id === id ? { ...e, published: !published } : e)));
    await revalidatePortfolio();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    const supabase = createClient();
    await supabase.from("experience").delete().eq("id", id);
    setItems(items.filter((e) => e.id !== id));
    showToast("Experience deleted");
    await revalidatePortfolio();
  };

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        {!showForm ? (
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add Experience</Button>
        ) : (
          <Card>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <Input label="Start Date" placeholder="Jan 2024" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <Input label="End Date" placeholder="Present" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={form.currently_working} />
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
            </div>
            <Textarea label="Description" className="mt-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.currently_working} onChange={(e) => setForm({ ...form, currently_working: e.target.checked })} />
                Currently working
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addItem}>Save</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        {items.length === 0 && !showForm ? (
          <EmptyState icon={Briefcase} title="No experience yet" description="Add your professional experience here." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{item.role}</h3>
                    <p className="text-sm text-primary">{item.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.start_date} — {item.currently_working ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePublished(item.id, item.published)}>
                      <Badge variant={item.published ? "success" : "default"}>{item.published ? "Published" : "Draft"}</Badge>
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
