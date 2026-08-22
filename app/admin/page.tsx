import { DashboardStatsCards, QuickActions } from "@/components/admin/dashboard-stats";
import { getDashboardStats } from "@/lib/data/dashboard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your portfolio content.</p>
      </div>

      <DashboardStatsCards stats={stats} />
      <QuickActions />
    </div>
  );
}
