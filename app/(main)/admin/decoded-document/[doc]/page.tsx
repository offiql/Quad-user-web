"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import PrescriptionForm from "@/components/admin/document/precription-form";
import { backend_url } from "@/lib/utils";
import { getUserData } from "@/lib/getTokens";

// Add these type definitions at the top of the file
type DocStatus = "processing" | "pending" | "confirmed" | "rejected";

interface StatusConfig {
  label: string;
  variant: "warning" | "secondary" | "success" | "destructive";
}

interface StatusConfigMap {
  [key: string]: StatusConfig;
}

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  duration: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  complaints: string[];
  clinicalFindings: string;
  diagnosis: string;
  medicines: Medicine[];
  advice: string[];
  additionalNotes: string;
}

// Update the doc interface
interface Doc {
  status?: DocStatus;
  fileUrl: string;
  decodedDocDetails: FormData;
  // ... other properties
}

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewers = dynamic(
  () => import("@/components/admin/document/pdf-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

// Update the getStatusBadge function
const getStatusBadge = (status: string) => {
  const statusConfig: StatusConfigMap = {
    processing: {
      label: "processing",
      variant: "warning",
    },
    edited: {
      label: "pending",
      variant: "secondary",
    },
    confirmed: {
      label: "confirmed",
      variant: "success",
    },
    rejected: {
      label: "rejected",
      variant: "destructive",
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.processing;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Update the state definition
const [doc, setDoc] = useState<Doc | undefined>();

export default function DecodedDocument() {
  const params = useParams();
  const [selectedFile, setSelectedFile] = useState<string>(
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  );
  const [formData, setFormData] = useState<FormData>();
  const isFileTypePDF = selectedFile.toLowerCase().endsWith(".pdf");
  const user = getUserData();

  useEffect(() => {
    const getDoc = async () => {
      if (!params?.doc) return;
      const response = await fetch(`${backend_url}/admin/doc/${params.doc}`);
      const data = await response.json();
      setSelectedFile(data.fileUrl);
      setFormData(data.decodedDocDetails);
      setDoc(data);
    };

    getDoc();
  }, [params]);

  return (
    <div className="flex h-dvh hide-scrollbar overflow-hidden">
      <div
        className={`relative w-full bg-red-500 h-2
            ${doc?.status === "processing" && "ring-2 ring-warning/20"}
            ${doc?.status === "pending" && "ring-2 ring-secondary/20"}
            ${doc?.status === "confirmed" && "ring-2 ring-success/20"}
            ${doc?.status === "rejected" && "ring-2 ring-destructive/20"}
          `}
      />
      {/* Left Side - Form */}
      {doc && formData && (
        <div className="relative z-0">
         
          <div
            className={`absolute z-50 w-1/2 bg-red-500 h-2
                    ${doc?.status === "processing" && "bg-warning/20"}
                    ${doc?.status === "pending" && "bg-secondary/20"}
                    ${doc?.status === "confirmed" && "bg-success/20"}
                    ${doc?.status === "rejected" && "bg-destructive/20"}
                  `}
          />
          <PrescriptionForm
            doc={doc}
            setDoc={setDoc}
            formData={formData}
            setFormData={setFormData}
            user={user}
            handleAssignDocument={() => {}}
          />
        </div>
      )}

      {/* Right Side - Preview */}
      <div className="w-[600px] border-l flex-1 overflow-y-auto hide-scrollbar overflow-hidden overscroll-contain">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Uploaded Prescription</h3>
            {doc?.status && getStatusBadge(doc.status)}
          </div>
          <div
            className={`relative aspect-[1/1.4] border rounded-lg overflow-hidden bg-white
            ${doc?.status === "processing" && "ring-2 ring-warning/20"}
            ${doc?.status === "pending" && "ring-2 ring-secondary/20"}
            ${doc?.status === "confirmed" && "ring-2 ring-success/20"}
            ${doc?.status === "rejected" && "ring-2 ring-destructive/20"}
          `}
          >
            {isFileTypePDF ? (
              <PDFViewers src={selectedFile} />
            ) : (
              <img
                src={selectedFile || "/placeholder.svg"}
                alt="Prescription Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              Uploaded on 30th Aug 2023
            </div>
            <Card
              className={`p-4
              ${doc?.status === "processing" && "border-warning/50"}
              ${doc?.status === "pending" && "border-secondary/50"}
              ${doc?.status === "confirmed" && "border-success/50"}
              ${doc?.status === "rejected" && "border-destructive/50"}
            `}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center">
                  Information
                  <span className="ml-2 w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                    i
                  </span>
                </h4>
                {doc?.status && getStatusBadge(doc.status)}
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Decoded by - </span>
                  Dr. Akshara
                </div>
                <div>
                  <span className="text-muted-foreground">
                    M.S., Reg No NMC 2018
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Decoded date - </span>
                  30/08/2023
                </div>
                <div>
                  <span className="text-muted-foreground">Decoded time - </span>
                  13:00 PM
                </div>
                <div>
                  <span className="text-muted-foreground">Status - </span>
                  <span
                    className={`
                    ${doc?.status === "processing" && "text-warning"}
                    ${doc?.status === "pending" && "text-secondary"}
                    ${doc?.status === "confirmed" && "text-success"}
                    ${doc?.status === "rejected" && "text-destructive"}
                  `}
                  >
                    {doc?.status}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
