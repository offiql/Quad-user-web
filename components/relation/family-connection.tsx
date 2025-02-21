"use client";

import { useState } from "react";
import { Pencil, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditRelationDialog } from "./edit-relation-dialogbox";
import type { Relation } from "../types/patient";

interface FamilyConnectionsProps {
  relationships: Relation[];
  loggedInUserId: string;
  onUpdateRelation: (
    relationId: string,
    newRelation: string,
    field: "requesterRelation" | "responderRelation"
  ) => Promise<void>;
  onUpdateStatus: (
    relationId: string,
    newStatus: "pending" | "confirmed" | "rejected",
    canViewPeriodsData: "Yes" | "No"
  ) => Promise<void>;
}

export function FamilyConnections({
  relationships,
  loggedInUserId,
  onUpdateRelation,
  onUpdateStatus,
}: FamilyConnectionsProps) {
  const [editingRelation, setEditingRelation] = useState<Relation | null>(null);

  const handleEdit = (relation: Relation) => {
    setEditingRelation(relation);
  };

  const handleSave = async (
    newYourRelation: string,
    newTheirRelation: string,
    newStatus: "pending" | "confirmed" | "rejected",
    canViewPeriodsData: "Yes" | "No"
  ) => {
    if (!editingRelation) return;

    const isRequester = editingRelation.requester.id === loggedInUserId;
    const newRequesterRelation = isRequester
      ? newYourRelation
      : newTheirRelation;
    const newResponderRelation = isRequester
      ? newTheirRelation
      : newYourRelation;
    console.log(editingRelation.canViewPeriodsData);
    if (newRequesterRelation !== editingRelation.requesterRelation) {
      await onUpdateRelation(
        editingRelation._id,
        newRequesterRelation,
        "requesterRelation"
      );
    }

    if (newResponderRelation !== editingRelation.responderRelation) {
      await onUpdateRelation(
        editingRelation._id,
        newResponderRelation,
        "responderRelation"
      );
    }

    if (
      newStatus !== editingRelation.status ||
      canViewPeriodsData !== editingRelation.canViewPeriodsData
    ) {
      await onUpdateStatus(editingRelation._id, newStatus, canViewPeriodsData);
    }

    setEditingRelation(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Connections</CardTitle>
        <CardDescription>Manage your family relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Your Relation to Them</TableHead>
              <TableHead>Their Relation to You</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationships.map((relation) => {
              const isRequester = relation.requester.id === loggedInUserId;
              const familyMember = isRequester
                ? relation.responder
                : relation.requester;
              const yourRelation = isRequester
                ? relation.requesterRelation
                : relation.responderRelation;
              const theirRelation = isRequester
                ? relation.responderRelation
                : relation.requesterRelation;

              return (
                <TableRow key={relation._id}>
                  <TableCell className="font-medium">
                    {familyMember.name}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {yourRelation}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your relation to {familyMember.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {theirRelation}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{familyMember.name}'s relation to you</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </TableCell>
                  <TableCell>{familyMember.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`
                      ${
                        relation.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""
                      }
                      ${
                        relation.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                      ${
                        relation.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : ""
                      }
                      p-0.5 px-4 rounded-full text-center mx-auto
                    `}
                    >
                      {relation.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(relation)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit relationship</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <EditRelationDialog
        relation={editingRelation}
        onClose={() => setEditingRelation(null)}
        onSave={handleSave}
        loggedInUserId={loggedInUserId}
      />
    </Card>
  );
}
