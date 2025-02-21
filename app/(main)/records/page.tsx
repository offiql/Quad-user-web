"use client";

import { useEffect, useState } from "react";
import {
  fetchDocuments,
  grantViewAccess,
  revokeViewAccess,
} from "@/components/uploaded-doc/docsApi";
import DocumentTable from "@/components/uploaded-doc/document-table";
import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { Relation } from "@/components/types/patient";
import Header from "@/components/header";
import MobileHeader from "@/components/mobile-header";

export default function RecordsPage() {
  const [documents, setDocuments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState<Relation[]>([]);
  const patient = getpatientData();

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchDocuments(patient._id);
      setDocuments(docs);
    };

    fetchRelations();
    loadDocuments();
  }, []);

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
      setFamilyMembers(data);
    } catch (error) {}
  };

  const handleUpdateViewAccess = async (
    documentId: string,
    relatedPatientId: string,
    isGrant: boolean
  ) => {
    if (isGrant) {
      await grantViewAccess(documentId, relatedPatientId);
    } else {
      await revokeViewAccess(documentId, relatedPatientId);
    }
    // Refresh documents after change
    const updatedDocs = await fetchDocuments(patient._id);
    setDocuments(updatedDocs);
  };

  return (
    <main className="">
      <MobileHeader />
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-4 md:p-8 pt-2 md:pt-4">
        <h1 className="text-2xl font-bold mb-5">My Documents</h1>
        <DocumentTable
          documents={documents}
          relationships={familyMembers}
          loggedInPatientId={patient._id}
          onUpdateViewAccess={handleUpdateViewAccess}
        />
      </div>
    </main>
  );
}
