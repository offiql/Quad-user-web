import { NotificationDashboard } from "@/components/admin/notification/notification-dashboard";

export default function page() {
  return (
    <main className="p-6 space-y-8 col-span-full md:col-span-3 overflow-y-auto h-full overflow-hidden hide-scrollbar">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">Notification Center</h1>
        <NotificationDashboard />
      </div>
    </main>
  );
}
