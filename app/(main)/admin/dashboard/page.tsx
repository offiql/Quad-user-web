"use client";

import Analytics from "@/components/admin/dashboard/analytics";
import TeamMembers from "@/components/admin/dashboard/team";
import Notifications from "@/components/admin/dashboard/notification";

export default function AnalyticsDashboard() {
  return (
    <div className="h-dvh grid md:grid-cols-4 overflow-y-auto overflow-hidden hide-scrollbar">
      <Analytics />
      <div className="hidden md:block md:col-span-1 hide-scrollbar pt-6 pb-3 pl-0 overflow-y-auto overflow-hidden h-dvh">
        <Notifications />
        <TeamMembers/>
      </div>
    </div>
  );
}
