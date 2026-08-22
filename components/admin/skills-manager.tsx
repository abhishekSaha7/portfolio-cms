"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { revalidatePortfolio } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types/database";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SkillsManagerProps {
  skills: Skill[];
}

export function SkillsManager({ skills: initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const supabase = createClient();
      const nextOrder = skills.length > 0 ? Math.max(...skills.map((s) => s.display_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("skills")
        .insert({ name: newSkill.trim(), display_order: nextOrder, enabled: true })
        .select()
        .single();
      if (error) throw error;
      setSkills([...skills, data]);
      setNewSkill("");
      showToast("Skill added");
      await revalidatePortfolio();
    } catch {
      showToast("Failed to add skill", "error");
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const supabase = createClient();
    await supabase.from("skills").update({ enabled: !enabled }).eq("id", id);
    setSkills(skills.map((s) => (s.id === id ? { ...s, enabled: !enabled } : s)));
    await revalidatePortfolio();
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const supabase = createClient();
    await supabase.from("skills").delete().eq("id", id);
    setSkills(skills.filter((s) => s.id !== id));
    showToast("Skill deleted");
    await revalidatePortfolio();
  };

  const moveSkill = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= skills.length) return;
    const updated = [...skills];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSkills(updated);
    const supabase = createClient();
    await Promise.all(updated.map((s, i) => supabase.from("skills").update({ display_order: i }).eq("id", s.id)));
    await revalidatePortfolio();
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        <div className="flex gap-2">
          <Input placeholder="New skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
          <Button onClick={addSkill}><Plus className="h-4 w-4" /> Add</Button>
        </div>

        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveSkill(index, "up")} disabled={index === 0} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => moveSkill(index, "down")} disabled={index === skills.length - 1} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
              </div>
              <span className="flex-1 text-sm">{skill.name}</span>
              <button onClick={() => toggleEnabled(skill.id, skill.enabled)}>
                <Badge variant={skill.enabled ? "success" : "default"}>{skill.enabled ? "Enabled" : "Disabled"}</Badge>
              </button>
              <button onClick={() => deleteSkill(skill.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
