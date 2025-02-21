"use client";

import { useState, useCallback, useEffect } from "react";
import type { Patient, Relation } from "@/components/types/patient";
import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import MobileHeader from "@/components/mobile-header";
import { FamilyConnections } from "@/components/relation/family-connection";
import Header from "@/components/header";
import { toast } from "sonner";

export default function FamilyConnectionsPage() {
  const [relationships, setRelationships] = useState<Relation[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);

  const fetchRelations = useCallback(async () => {
    const access_token = getAccessToken();
    try {
      const response = await fetch(`${backend_url}/patient/get-all-relations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch relations");

      const data: Relation[] = await response.json();
      setRelationships(data);
    } catch (error) {
      console.error("Error fetching relations:", error);
    }
  }, []);

  useEffect(() => {
    const patientData = getpatientData();
    if (patientData) {
      setPatient(patientData);
      fetchRelations();
    }
  }, [fetchRelations]);

  const handleUpdateRelation = useCallback(
    async (relationId: string, newRelation: string, relationReqRes: string) => {
      if (!patient) return;

      const access_token = getAccessToken();
      try {
        const response = await fetch(`${backend_url}/patient/update-relation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: patient._id,
            relationId,
            relationReqRes,
            newRelation,
          }),
        });

        if (!response.ok) throw new Error("Failed to update relation");
        const data = await response.json();
        setRelationships(data);
        if (data.message) {
          toast.error(data.message);
        } else toast.success("Relationship Updated Successfully!");
      } catch (error) {
        console.error("Error updating relation:", error);
        toast.error("Failed to update relationship");
      }
    },
    [patient]
  );

  const handleUpdateStatus = useCallback(
    async (
      relationId: string,
      newStatus: "pending" | "confirmed" | "rejected",
      canViewPeriodsData: "Yes" | "No"
    ) => {
      if (!patient) return;

      const access_token = getAccessToken();
      try {
        const response = await fetch(
          `${backend_url}/patient/update-relation-status`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: patient._id,
              relationId,
              newStatus,
              canViewPeriodsData
            }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update relationship");
        }
        setRelationships(data);
        toast.success("Relationship Status Updated Successfully!");
      } catch (error) {
        console.error("Error updating relation status:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
    [patient]
  );

  return (
    <main>
      <MobileHeader />
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-4 md:p-8 pt-2 md:pt-4">
        <h1 className="text-2xl font-bold mb-5">My Relations</h1>
        {patient && (
          <FamilyConnections
            relationships={relationships}
            loggedInUserId={patient._id}
            onUpdateRelation={handleUpdateRelation}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </main>
  );
}
