"use client";

import { logout } from "@/lib/auth/actions";
import { AdminSidebar } from "./sidebar";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  userEmail?: string;
}

export function AdminShell({ children, title, userEmail }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar onLogout={() => logout()} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <h1 className="text-lg font-semibold ml-12 lg:ml-0">{title}</h1>
            {userEmail && (
              <span className="text-sm text-muted-foreground">{userEmail}</span>
            )}
          </div>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
