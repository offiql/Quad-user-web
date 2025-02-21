"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PrescriptionForm from "@/components/admin/document/precription-form";
import { backend_url } from "@/lib/utils";
import { toast } from "sonner";
import { getUserData } from "@/lib/getTokens";

// Define the possible document statuses
export type DocStatus = "processing" | "pending" | "confirmed" | "rejected";

// Define StatusConfig structure
interface StatusConfig {
  label: string;
  variant: "warning" | "secondary" | "success" | "destructive";
}

// Define a mapping of statuses to their configurations
type StatusConfigMap = {
  [key in DocStatus]: StatusConfig;
};

// Define the structure for medicines
interface Medicine {
  id: number;
  name: string;
  dosage: string;
  duration: string;
}

// Define the structure of the form data
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

// Define the structure of a document
interface Doc {
  status?: DocStatus;
  fileUrl: string;
  decodedDocDetails: FormData;
  rejectionReason: string;
}

// Dynamically import the PDF viewer
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

// Status configuration mapping
const statusConfig: StatusConfigMap = {
  processing: {
    label: "Processing",
    variant: "warning",
  },
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  confirmed: {
    label: "Confirmed",
    variant: "success",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
  },
};

// Function to get status badge
const getStatusBadge = (status: DocStatus) => {
  const config = statusConfig[status] || statusConfig.processing;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Main component
export default function DecodedDocument() {
  const params = useParams();
  const router = useRouter();
  const user = getUserData();

  const [doc, setDoc] = useState<Doc | undefined>();
  const [selectedFile, setSelectedFile] = useState<string>(
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  );
  const [formData, setFormData] = useState<FormData>();
  const isFileTypePDF = selectedFile.toLowerCase().endsWith(".pdf");

  // Function to assign a document
  const handleAssignDocument = async () => {
    try {
      const response = await fetch(
        `${backend_url}/admin/${user.userId}/assign-pending-documents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newDocId = await response.json();

      if (!response.ok) {
        toast.error(newDocId.message || "Failed to assign documents.");
        return;
      }

      router.push(`/team/decoded-document/${newDocId}`);
    } catch (error) {
      console.error("Error assigning documents:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Fetch document data
  useEffect(() => {
    const getDoc = async () => {
      if (!params?.doc) return;

      try {
        const response = await fetch(`${backend_url}/admin/doc/${params.doc}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error("Failed to fetch document");
          return;
        }

        setSelectedFile(data.fileUrl);
        setFormData(data.decodedDocDetails);
        setDoc(data);
      } catch (error) {
        console.error("Error fetching document:", error);
        toast.error("Something went wrong while fetching the document");
      }
    };

    getDoc();
  }, [params]);

  return (
    <div className="flex h-dvh hide-scrollbar overflow-hidden">
      {/* Left Side - Form */}
      {doc && formData && (
        <div className="relative flex-1">
          <div
            className={`absolute inset-x-0 top-0 h-1.5 z-50
              ${doc.status === "processing" && "bg-orange-500"}
              ${doc.status === "pending" && "bg-gray-500"}
              ${doc.status === "confirmed" && "bg-green-500"}
              ${doc.status === "rejected" && "bg-destructive"}
            `}
          />
          <PrescriptionForm
            doc={doc}
            setDoc={setDoc}
            formData={formData}
            setFormData={setFormData}
            user={user}
            handleAssignDocument={handleAssignDocument}
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
             ${doc?.status === "processing" && "border-orange-500"}
              ${doc?.status === "pending" && "border-gray-500"}
              ${doc?.status === "confirmed" && "border-green-500"}
              ${doc?.status === "rejected" && "border-destructive"}
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
            <Card className="p-4">
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
                {doc?.rejectionReason && doc?.status==="rejected" && (
                  <div>
                    <span className="text-muted-foreground">
                      Rejection Reason -{" "}
                    </span>
                    <span className="text-destructive">
                      {doc?.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
