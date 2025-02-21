"use client";

import { useState } from "react";
import DocumentTypeSelection from "@/components/upload-doc/doc-type-selection";
import UploadDocumentsStep from "@/components/upload-doc/upload-doc";
import DocumentDetailsStep from "@/components/upload-doc/detail-step";
import UploadSuccess from "@/components/upload-doc/upload-success";
import MobileHeader from "@/components/mobile-header";
import { backend_url } from "@/lib/utils";
import axios from "axios";
import { getpatientData } from "@/lib/getTokens";
import { toast } from "sonner";

type DocumentType = "prescription" | "lab-report" | null;
type UploadStep = "type-selection" | "upload" | "details" | "success";

export default function UploadDocumentsPage() {
  const [step, setStep] = useState<UploadStep>("type-selection");
  const [documentType, setDocumentType] = useState<DocumentType>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loader, setLoader] = useState(false);
  const handleTypeSelection = (type: DocumentType) => {
    setDocumentType(type);
    setStep("upload");
  };

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setStep("details");
  };

  const handleDetailsSubmitted = async (details: any) => {
    const patient = getpatientData();
    if (!uploadedFiles.length || !documentType) {
      console.error("Files or document type missing");
      return;
    }

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("uploadedAt", new Date().toISOString());
    formData.append("details", JSON.stringify(details));
    formData.append("patientId", patient._id);

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoader(true);
      const response = await axios.post(`${backend_url}/s3upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Details submitted successfully:", response.data);
      toast.success("Documents uploaded successfully!");
      setStep("success");
    } catch (error) {
      console.error("Details submission failed:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleReset = () => {
    setStep("type-selection");
    setDocumentType(null);
    setUploadedFiles([]);
  };

  const handleBack = () => {
    switch (step) {
      case "upload":
        setStep("type-selection");
        setDocumentType(null);
        break;
      case "details":
        setStep("upload");
        break;
      default:
        break;
    }
  };

  return (
    <main className="">
      <MobileHeader />
      <div className="pb-8 pt-10">
        <div className="flex justify-center flex-col pb-8 items-center">
          <h1 className="text-center text-2xl font-semibold">
            Upload Your Medical Reports
          </h1>
          <p className="text-center text-gray-500/70 text-sm">
            Upload your prescriptions or lab reports to maintain easy access to
            your medical history
          </p>
        </div>
        {step === "type-selection" && (
          <DocumentTypeSelection onSelect={handleTypeSelection} />
        )}
        {step === "upload" && documentType && (
          <UploadDocumentsStep
            documentType={documentType}
            onNext={handleFilesUploaded}
            onBack={handleBack}
          />
        )}
        {step === "details" && (
          <DocumentDetailsStep
            loader={loader}
            onNext={handleDetailsSubmitted}
            onBack={handleBack}
          />
        )}
        {step === "success" && <UploadSuccess onReset={handleReset} />}
      </div>
    </main>
  );
}
