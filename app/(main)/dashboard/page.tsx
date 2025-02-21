import HealthMonitoring from "@/components/dashboard/monitor";
import PeriodTracker from "@/components/dashboard/periods-tracker";
import FamilyTree from "@/components/FamilyTree";
import Header from "@/components/header";
import InsurranceDetails from "@/components/insurrance-details";
import KidsVacinations from "@/components/KidsVacinations";
import MobileHeader from "@/components/mobile-header";
import Notifications from "@/components/notifications";
import PendingCheckups from "@/components/pending-checkups";
import ProfileSection from "@/components/profile-section";
import WelcomeCard from "@/components/welcome-card";

export default function DashboardPage() {
  return (
    <main className="grid md:grid-cols-4">
      <div className="col-span-full md:col-span-3 overflow-y-auto h-dvh hide-scrollbar pb-4">
        <MobileHeader />
        <div className="hidden md:block">
          <Header />
        </div>
        <section className="p-4 md:p-8">
          <div className="space-y-6">
            <WelcomeCard />
            <div className="block md:hidden">
              <PendingCheckups />
            </div>
            <div className="gap-6">
              <InsurranceDetails />
            </div>
            <FamilyTree />
          </div>
        </section>
        <HealthMonitoring />
        <PeriodTracker />
      </div>
      <div className="hidden md:block md:col-span-1 hide-scrollbar pt-6 pb-3 pl-0 overflow-y-auto overflow-hidden h-dvh">
        <ProfileSection />
        <Notifications />
        <KidsVacinations />
      </div>
    </main>
  );
}
