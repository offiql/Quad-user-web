"use client";

import { useEffect, useState } from "react";
import MobileHeader from "@/components/mobile-header";
import PatientProfile from "@/components/profile/patientProfile";
import RelationProfile from "@/components/profile/relationProfile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Relation } from "@/components/types/patient";
import { getAccessToken } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("patient");
  const [familyMembers, setFamilyMembers] = useState<Relation[]>([]);

  const fetchRelations = async () => {
    const access_token = getAccessToken();
    try {
      const response = await fetch(`${backend_url}/patient/get-relations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setFamilyMembers(data);
    } catch (error) {
      toast.error("Error fetching relations");
    }
  };

  useEffect(() => {
    fetchRelations();
  }, []);
  return (
    <main className="max-h-dvh hide-scrollbar overflow-y-auto overflow-hidden overscroll-contain">
      <MobileHeader />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">Patient Profile</TabsTrigger>
          <TabsTrigger value="relation">Relations Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="patient">
          <PatientProfile />
        </TabsContent>
        <TabsContent className="" value="relation">
          <RelationProfile familyMembers={familyMembers}/>
        </TabsContent>
      </Tabs>
    </main>
  );
}
