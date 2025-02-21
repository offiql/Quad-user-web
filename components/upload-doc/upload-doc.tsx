"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import Stepper from "./stepper";

interface UploadDocumentsStepProps {
  documentType: "prescription" | "lab-report";
  onNext: (files: File[]) => void;
  onBack: () => void;
}

const UploadDocumentsStep = ({
  documentType,
  onNext,
  onBack,
}: UploadDocumentsStepProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((files) => files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 space-y-6">
      <Stepper currentStep={0} steps={["Upload Documents", "Fill Details"]} />

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Click here to upload or drag and drop your{" "}
          {documentType === "prescription" ? "prescription" : "lab report"}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Files</h3>
          <div className="rounded-lg border">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b p-4 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext(uploadedFiles)}
          disabled={uploadedFiles.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UploadDocumentsStep;
