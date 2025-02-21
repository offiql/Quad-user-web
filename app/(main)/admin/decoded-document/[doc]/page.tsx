"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation"; // Import useParams
import { Card } from "@/components/ui/card";
import PrescriptionForm from "@/components/admin/document/precription-form";
import { backend_url } from "@/lib/utils";
import { getUserData } from "@/lib/getTokens";
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

export default function DecodedDocument() {
  const params = useParams();
  const [doc, setDoc] = useState();
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
  }, [params]); // Ensure useEffect runs when params change

  return (
    <div className="flex h-dvh hide-scrollbar">
      {/* Left Side - Form */}
      {doc && formData && (
        <PrescriptionForm
          doc={doc}
          setDoc={setDoc}
          formData={formData}
          setFormData={setFormData}
          user={user}
          handleAssignDocument={() => {}}
        />
      )}

      {/* Right Side - Preview */}
      <div className="w-[600px] border-l flex-1 overflow-y-auto hide-scrollbar overflow-hidden overscroll-contain">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Uploaded Prescription</h3>
          <div className="relative aspect-[1/1.4] border rounded-lg overflow-hidden bg-white">
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
              <h4 className="font-medium mb-2 flex items-center">
                Information
                <span className="ml-2 w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                  i
                </span>
              </h4>
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
