"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { toast } from "sonner";
import { Patient, Relation } from "./types/patient";

const FamilyTree = () => {
  const [familyMembers, setFamilyMembers] = useState<Relation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [familyMemberEmail, setFamilyMemberEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [responderRelation, setResponderRelation] = useState("");
  const [relationshipDetails, setRelationshipDetails] = useState("");
  const [emailError, setEmailError] = useState("");
  const [relationError, setRelationError] = useState("");
  const [responderRelationError, setResponderRelationError] = useState("");
  const [patient, setPatient] = useState<Patient>();

  const fetchRelations = async () => {
    const access_token = getAccessToken();
    try {
      const response = await fetch(`${backend_url}/patient/get-relations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch relations");
        return;
      }

      const data = await response.json();
      console.log(data);
      setFamilyMembers(data);
    } catch (error) {
      toast.error("Error fetching relations");
    }
  };

  useEffect(() => {
    const patient = getpatientData();
    setPatient(patient);
    fetchRelations();
  }, []);

  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setRelationError("");
    setResponderRelationError("");
    let isValid = true;
    if (!familyMemberEmail) {
      setEmailError("Email is required");
      isValid = false;
    }
    if (!relation) {
      setRelationError("Your relation is required");
      isValid = false;
    }
    if (!responderRelation) {
      setResponderRelationError("Responder's relation is required");
      isValid = false;
    }

    if (!isValid) return;
    const access_token = getAccessToken();

    const payload = {
      familyMemberEmail,
      requesterRelation: relation,
      responderRelation,
      relationshipDetails,
    };

    try {
      const response = await fetch(`${backend_url}/patient/add-family-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(
          `Family member added successfully!\nWaiting for confirmation.`
        );
      }
      setFamilyMemberEmail("");
      setRelation("");
      setResponderRelation("");
      setRelationshipDetails("");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error adding family member!");
    }
  };

  return (
    <div className="mt-6 col-span-2 rounded-lg">
      <div className="flex items-center justify-between mb-4 border-b">
        <h3 className="text-lg font-semibold text-[#59748A]">Family Tree</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground"
        >
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {patient &&
          familyMembers
            .filter((relation) => {
              // Show responder if requester matches patient
              if (relation.requester.id === patient._id)
                return relation.status === "confirmed";

              // Show requester if responder matches patient
              if (relation.responder.id === patient._id)
                return relation.status === "confirmed";

              return false;
            })
            .map((relation) => {
              const isRequester = relation.requester.id === patient._id;
              const displayPerson = isRequester
                ? relation.responder
                : relation.requester; // Determine whom to display
              return (
                <div
                  key={displayPerson.id}
                  className="flex flex-col items-center justify-center p-4 bg-[#F8EFFF] rounded-lg shadow text-center"
                >
                  <Avatar className="mx-auto w-10 h-10">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={displayPerson.name}
                    />
                    <AvatarFallback>
                      {displayPerson.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-[#112449] font-medium">
                    {displayPerson.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({isRequester ? relation.requesterRelation : relation.responderRelation})
                  </span>
                </div>
              );
            })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center justify-center p-4 bg-[#F8EFFF] rounded-lg text-center cursor-pointer shadow transition-colors">
              <FaPlus className="mx-auto w-8 h-8 mb-2 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Add Family Member
              </span>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Enter the details of the family member you want to add.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddFamilyMember}>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="familyMemberEmail" className="text-right ">
                    Email
                  </Label>
                  <Input
                    id="familyMemberEmail"
                    type="email"
                    value={familyMemberEmail}
                    onChange={(e) => setFamilyMemberEmail(e.target.value)}
                    className="max-w-[50%]"
                    required
                  />
                  {emailError && (
                    <span className="text-red-500 text-sm">{emailError}</span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="relation" className="text-right ">
                    Your Relation
                  </Label>
                  <Select value={relation} onValueChange={setRelation} required>
                    <SelectTrigger className="max-w-[50%]">
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Brother">Brother</SelectItem>
                      <SelectItem value="Sister">Sister</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {relationError && (
                    <span className="text-red-500 text-sm">
                      {relationError}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="responderRelation" className="text-right ">
                    Responder's Relation
                  </Label>
                  <Select
                    value={responderRelation}
                    onValueChange={setResponderRelation}
                    required
                  >
                    <SelectTrigger className="max-w-[50%]">
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Brother">Brother</SelectItem>
                      <SelectItem value="Sister">Sister</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {responderRelationError && (
                    <span className="text-red-500 text-sm">
                      {responderRelationError}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="relationshipDetails" className="text-right ">
                    Details
                  </Label>
                  <Textarea
                    id="relationshipDetails"
                    value={relationshipDetails}
                    onChange={(e) => setRelationshipDetails(e.target.value)}
                    className="max-w-[50%]"
                    placeholder="Additional details about the relationship"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    !familyMemberEmail || !relation || !responderRelation
                  }
                >
                  Add Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FamilyTree;
