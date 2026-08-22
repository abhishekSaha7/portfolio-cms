import { SettingsForm } from "@/components/admin/settings-form";
import { getUser } from "@/lib/auth/actions";

export default async function AdminSettingsPage() {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage admin authentication and account preferences.</p>
      </div>
      <SettingsForm userEmail={user?.email} />
    </div>
  );
}
