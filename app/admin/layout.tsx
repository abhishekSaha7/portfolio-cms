import { AdminShell } from "@/components/admin/admin-shell";
import { getUser } from "@/lib/auth/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <AdminShell title="" userEmail={user?.email}>
      {children}
    </AdminShell>
  );
}
