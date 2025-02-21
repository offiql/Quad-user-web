"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { backend_url } from "@/lib/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { PrescriptionPDF } from "./precription-pdf";
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

export default function PrescriptionForm({
  doc,
  setDoc,
  formData,
  setFormData,
  user,
  handleAssignDocument,
}: {
  doc: any;
  setDoc: any;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData | undefined>>;
  user: any;
  handleAssignDocument: any;
}) {
  const [availableComplaints] = useState([
    "Fever with chills",
    "Headache",
    "Cough",
    "Cold",
  ]);
  const handleComplaintToggle = (complaint: string) => {
    setFormData((prev: any) => ({
      ...prev,
      complaints: prev.complaints.includes(complaint)
        ? prev.complaints.filter((c: any) => c !== complaint)
        : [...prev.complaints, complaint],
    }));
  };

  const addMedicine = () => {
    const newMedicine = {
      id: formData.medicines.length + 1,
      name: "",
      dosage: "",
      duration: "",
    };
    setFormData((prev: any) => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine],
    }));
  };

  const addAdvice = () => {
    setFormData((prev: any) => ({
      ...prev,
      advice: [...prev.advice, ""],
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${backend_url}/admin/save/decoded-doc/${doc?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData, status: doc.status }),
        }
      );

      if (response.ok) {
        toast.success("Saved successfully");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleStatusChange = (value: "pending" | "confirmed" | "rejected") => {
    setDoc((prev: any) => ({ ...prev, status: value }));
  };
  return (
    <div className="flex-1 p-6 overflow-y-auto hide-scrollbar overflow-hidden overscroll-contain">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Decoded Document</h2>
        {user && (
          <div className="flex items-center space-x-2">
            <Select value={doc.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSave}>Save</Button>
            {user?.type === "team" && (
              <Button onClick={handleAssignDocument}>Next</Button>
            )}
            <PDFDownloadLink
              document={<PrescriptionPDF formData={formData} />}
              fileName="decoded-document.pdf"
            >
              {({ blob, url, loading, error }) => (
                <Button disabled={loading}>
                  {loading ? "Generating PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Patient Name */}
        <div className="space-y-2">
          <Label>Patient Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            placeholder="OPDS PATIENT"
          />
        </div>

        {/* Chief complaints */}
        <div className="space-y-2">
          <Label>Chief complaints</Label>
          <div className="flex flex-wrap gap-2">
            {availableComplaints.map((complaint) => (
              <Badge
                key={complaint}
                variant={
                  formData.complaints.includes(complaint)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleComplaintToggle(complaint)}
              >
                {complaint}
                {formData.complaints.includes(complaint) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Clinical Findings */}
        <div className="space-y-2">
          <Label>Clinical Findings</Label>
          <Textarea
            value={formData.clinicalFindings}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                clinicalFindings: e.target.value,
              }))
            }
          />
        </div>

        {/* Diagnosis */}
        <div className="space-y-2">
          <Label>Diagnosis</Label>
          <Input
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                diagnosis: e.target.value,
              }))
            }
          />
        </div>

        {/* Medicines */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Medicines</Label>
            <Button variant="outline" size="sm" onClick={addMedicine}>
              Add Medicine
            </Button>
          </div>
          <Card className="p-4">
            {formData.medicines.map((medicine, index) => (
              <div
                key={medicine.id}
                className="grid grid-cols-3 gap-4 mb-4 last:mb-0"
              >
                <div className="space-y-2">
                  <Label>{`${index + 1}.Medicine Name`}</Label>
                  <Input
                    value={medicine.name}
                    onChange={(e) => {
                      const newMedicines = [...formData.medicines];
                      newMedicines[index] = {
                        ...medicine,
                        name: e.target.value,
                      };
                      setFormData((prev: any) => ({
                        ...prev,
                        medicines: newMedicines,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input
                    value={medicine.dosage}
                    onChange={(e) => {
                      const newMedicines = [...formData.medicines];
                      newMedicines[index] = {
                        ...medicine,
                        dosage: e.target.value,
                      };
                      setFormData((prev: any) => ({
                        ...prev,
                        medicines: newMedicines,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={medicine.duration}
                    onChange={(e) => {
                      const newMedicines = [...formData.medicines];
                      newMedicines[index] = {
                        ...medicine,
                        duration: e.target.value,
                      };
                      setFormData((prev: any) => ({
                        ...prev,
                        medicines: newMedicines,
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Advice */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Advice</Label>
            <Button variant="outline" size="sm" onClick={addAdvice}>
              Add Advice
            </Button>
          </div>
          <Card className="p-4">
            {formData.advice.map((advice, index) => (
              <Input
                key={index}
                value={advice}
                className="mb-2 last:mb-0"
                onChange={(e) => {
                  const newAdvice = [...formData.advice];
                  newAdvice[index] = e.target.value;
                  setFormData((prev: any) => ({ ...prev, advice: newAdvice }));
                }}
              />
            ))}
          </Card>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                additionalNotes: e.target.value,
              }))
            }
            placeholder="Write here..."
          />
        </div>
      </div>
    </div>
  );
}
