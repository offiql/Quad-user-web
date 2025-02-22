"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getpatientData } from "@/lib/getTokens";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import KidsVacinations from "./KidsVacinations";
import Sidebar from "./mobile-sidebar";
import Notifications from "./notifications";
import ProfileSection from "./profile-section";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NotificationsComponent from "./notificationComponent";

export default function MobileHeader() {
  const pathname = usePathname();
  const patient = getpatientData();
  const getTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/records":
        return "Medical Records";
      case "/upload-documents":
        return "Upload Documents";
      case "/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center bg-white justify-between p-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <VisuallyHidden asChild>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="overflow-y-auto h-full hide-scrollbar">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>

        <span className="font-semibold">{getTitle()}</span>

        <div className="flex items-center gap-3">
          <NotificationsComponent />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <span className="">
                  <Avatar className="h-8 w-8 mx-auto">
                    <AvatarImage src={patient.image} alt="@shadcn" />
                    <AvatarFallback className="flex items-center justify-center bg-purple-100 text-sm text-purple-700 font-semibold shrink-0">
                      {patient.firstName?.[0]}
                      {patient.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0">
              <VisuallyHidden asChild>
                <SheetTitle>User Profile</SheetTitle>
              </VisuallyHidden>
              <div className="overflow-y-auto p-6 h-full hide-scrollbar">
                <ProfileSection />
                <Notifications />
                <KidsVacinations />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
