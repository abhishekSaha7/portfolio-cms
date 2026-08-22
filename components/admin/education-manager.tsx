"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import type { Education } from "@/types/database";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface EducationManagerProps {
  education: Education[];
}

export function EducationManager({ education: initial }: EducationManagerProps) {
  const [items, setItems] = useState(initial);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ degree: "", institution: "", year: "", marks: "" });

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const addItem = async () => {
    if (!form.degree || !form.institution) return;
    try {
      const supabase = createClient();
      const nextOrder = items.length > 0 ? Math.max(...items.map((e) => e.display_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("education")
        .insert({ ...form, display_order: nextOrder, enabled: true })
        .select()
        .single();
      if (error) throw error;
      setItems([...items, data]);
      setForm({ degree: "", institution: "", year: "", marks: "" });
      setShowForm(false);
      showToast("Education entry added");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to add entry", "error");
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const supabase = createClient();
    await supabase.from("education").update({ enabled: !enabled }).eq("id", id);
    setItems(items.map((e) => (e.id === id ? { ...e, enabled: !enabled } : e)));
    await revalidatePortfolio();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const supabase = createClient();
    await supabase.from("education").delete().eq("id", id);
    setItems(items.filter((e) => e.id !== id));
    showToast("Entry deleted");
    await revalidatePortfolio();
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setItems(updated);
    const supabase = createClient();
    await Promise.all(updated.map((e, i) => supabase.from("education").update({ display_order: i }).eq("id", e.id)));
    await revalidatePortfolio();
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        {!showForm ? (
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add Education</Button>
        ) : (
          <Card>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
              <Input label="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
              <Input label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              <Input label="Marks/CGPA" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addItem}>Save</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem(index, "up")} disabled={index === 0} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => moveItem(index, "down")} disabled={index === items.length - 1} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.degree}</p>
                <p className="text-xs text-muted-foreground">{item.institution} {item.year && `· ${item.year}`} {item.marks && `· ${item.marks}`}</p>
              </div>
              <button onClick={() => toggleEnabled(item.id, item.enabled)}>
                <Badge variant={item.enabled ? "success" : "default"}>{item.enabled ? "Enabled" : "Disabled"}</Badge>
              </button>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
