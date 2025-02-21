import { Bell } from "lucide-react";
import React from "react";

const KidsVacinations = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-[#59748A]">Kids Vaccination</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Bell className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium">Vaccination II</p>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>12:20:00 PM</span>
              <span>15 Oct 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsVacinations;
