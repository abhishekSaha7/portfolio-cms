"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function SettingsForm({ userEmail }: { userEmail?: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setToast({ message: "Password must be at least 6 characters long", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setToast({ message: "Password updated successfully!", type: "success" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8 max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Account Information</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Signed in as:</span>
              <span className="font-medium">{userEmail || "Admin User"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium text-primary">Administrator</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Session Security:</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Supabase Auth SSR
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="text-xs text-muted-foreground">Update your administrative account password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
