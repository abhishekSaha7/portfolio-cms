import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardStats } from "@/types/database";
import { Briefcase, FileText, FolderOpen, Star, User, Wrench } from "lucide-react";
import Link from "next/link";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const cards = [
    { label: "Projects", value: stats.projectCount, icon: FolderOpen, href: "/admin/projects", color: "text-primary" },
    { label: "Featured", value: stats.featuredCount, icon: Star, href: "/admin/projects", color: "text-yellow-400" },
    { label: "Skills", value: stats.skillsCount, icon: Wrench, href: "/admin/skills", color: "text-accent" },
    { label: "Profile", value: `${stats.profileCompletion}%`, icon: User, href: "/admin/profile", color: "text-success" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card hover className="group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
          </Card>
        </Link>
      ))}

      <Card className="sm:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="!text-base">Resume Status</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stats.resumePublished ? "A resume is currently published and available for download." : "No resume is published yet."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={stats.resumePublished ? "success" : "warning"}>
              {stats.resumePublished ? "Published" : "Not Published"}
            </Badge>
            <Link href="/admin/resume">
              <Button variant="secondary" size="sm">Manage</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function QuickActions() {
  const actions = [
    { label: "Add Project", href: "/admin/projects", icon: FolderOpen },
    { label: "Edit Profile", href: "/admin/profile", icon: User },
    { label: "Manage Skills", href: "/admin/skills", icon: Wrench },
    { label: "Add Experience", href: "/admin/experience", icon: Briefcase },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="secondary" className="w-full justify-start">
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
