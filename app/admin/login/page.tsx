import { LoginForm } from "@/components/admin/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            Portfolio<span className="text-primary">CMS</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to manage your portfolio</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
