import { HeroManager } from "@/components/admin/hero-manager";
import { getHeroTitles } from "@/lib/data/hero";

export default async function AdminHeroPage() {
  const titles = await getHeroTitles(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hero Titles</h2>
        <p className="text-muted-foreground mt-1">Manage the animated rotating titles on your homepage hero section.</p>
      </div>
      <HeroManager titles={titles} />
    </div>
  );
}
