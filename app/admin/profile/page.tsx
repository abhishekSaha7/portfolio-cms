import { ProfileForm } from "@/components/admin/profile-form";
import { getProfile } from "@/lib/data/profile";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  if (!profile) return <p>Profile not found. Run the database migration first.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your personal information and profile image.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
