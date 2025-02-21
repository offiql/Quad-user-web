"use client";

import { FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface DocumentTypeSelectionProps {
  onSelect: (type: "prescription" | "lab-report") => void;
}

export default function DocumentTypeSelection({
  onSelect,
}: DocumentTypeSelectionProps) {
  return (
    <div className="mx-auto max-w-md space-y-6">

      <div className="grid gap-4 px-4">
        <Button
          variant="outline"
          className="flex h-auto flex-col gap-2 p-6 md:p-10"
          onClick={() => onSelect("prescription")}
        >
          <FileText className="h-8 w-8" />
          <div>
            <p className="font-medium">Upload Prescription</p>
            <p className="text-xs text-muted-foreground">Size: Max 25 MB</p>
          </div>
        </Button>
        <p className="text-center">OR</p>
        <Button
          variant="outline"
          className="flex h-auto flex-col gap-2 p-6 md:p-10"
          onClick={() => onSelect("lab-report")}
        >
          <Upload className="h-8 w-8" />
          <div>
            <p className="font-medium">Upload Lab Report</p>
            <p className="text-xs text-muted-foreground">Size: Max 25 MB</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
