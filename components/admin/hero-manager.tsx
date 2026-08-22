"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import type { HeroTitle } from "@/types/database";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface HeroManagerProps {
  titles: HeroTitle[];
}

export function HeroManager({ titles: initialTitles }: HeroManagerProps) {
  const [titles, setTitles] = useState(initialTitles);
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const addTitle = async () => {
    if (!newTitle.trim()) return;
    setLoading("add");
    try {
      const supabase = createClient();
      const nextOrder = titles.length > 0 ? Math.max(...titles.map((t) => t.display_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("hero_titles")
        .insert({ title: newTitle.trim(), display_order: nextOrder, enabled: true })
        .select()
        .single();
      if (error) throw error;
      setTitles([...titles, data]);
      setNewTitle("");
      showToast("Title added");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to add title", "error");
    } finally {
      setLoading(null);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("hero_titles").update({ enabled: !enabled }).eq("id", id);
      setTitles(titles.map((t) => (t.id === id ? { ...t, enabled: !enabled } : t)));
      await revalidatePortfolio();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const deleteTitle = async (id: string) => {
    if (!confirm("Delete this title?")) return;
    try {
      const supabase = createClient();
      await supabase.from("hero_titles").delete().eq("id", id);
      setTitles(titles.filter((t) => t.id !== id));
      showToast("Title deleted");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const moveTitle = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= titles.length) return;

    const updated = [...titles];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTitles(updated);

    try {
      const supabase = createClient();
      await Promise.all(
        updated.map((t, i) =>
          supabase.from("hero_titles").update({ display_order: i }).eq("id", t.id)
        )
      );
      await revalidatePortfolio();
    } catch {
      showToast("Failed to reorder", "error");
    }
  };

  const updateTitle = async (id: string, title: string) => {
    try {
      const supabase = createClient();
      await supabase.from("hero_titles").update({ title }).eq("id", id);
      setTitles(titles.map((t) => (t.id === id ? { ...t, title } : t)));
      await revalidatePortfolio();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        <div className="flex gap-2">
          <Input
            placeholder="New hero title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTitle())}
          />
          <Button onClick={addTitle} loading={loading === "add"}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {titles.map((title, index) => (
            <div
              key={title.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveTitle(index, "up")}
                  disabled={index === 0}
                  className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveTitle(index, "down")}
                  disabled={index === titles.length - 1}
                  className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <input
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                value={title.title}
                onChange={(e) => {
                  setTitles(titles.map((t) => (t.id === title.id ? { ...t, title: e.target.value } : t)));
                }}
                onBlur={(e) => updateTitle(title.id, e.target.value)}
              />

              <button onClick={() => toggleEnabled(title.id, title.enabled)}>
                <Badge variant={title.enabled ? "success" : "default"}>
                  {title.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </button>

              <button
                onClick={() => deleteTitle(title.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete title"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
