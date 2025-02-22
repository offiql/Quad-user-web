'use client'

import React, { useState, useCallback } from "react"
import { Eye, FileText, MoreHorizontal, UserPlus, UserMinus } from 'lucide-react'
import { DocumentDetails, Relation } from "../types/patient"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AccessControlDialog from "./access-control-dialog"

interface TableProps {
  documents: DocumentDetails[]
  loggedInPatientId: string
  relationships: Relation[]
  onUpdateViewAccess: (
    documentId: string,
    relatedPatientId: string,
    isGrant: boolean
  ) => Promise<void>
}

export default function DocumentTable({
  documents,
  loggedInPatientId,
  relationships,
  onUpdateViewAccess,
}: TableProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetails | null>(null)

  const filteredRelations = relationships.filter(
    (relation) =>
      (relation.requester.id === loggedInPatientId ||
        relation.responder.id === loggedInPatientId) &&
      relation.status === "confirmed"
  )

  const handleUpdateViewAccess = useCallback(async (
    documentId: string,
    relatedPatientId: string,
    isGrant: boolean
  ) => {
    await onUpdateViewAccess(documentId, relatedPatientId, isGrant)
    // Update the selected document if it's the one being modified
    if (selectedDocument && selectedDocument._id === documentId) {
      setSelectedDocument((prevDoc:any) => {
        if (!prevDoc) return null
        return {
          ...prevDoc,
          canViewPatients: isGrant
            ? [...prevDoc.canViewPatients, relatedPatientId]
            : prevDoc.canViewPatients.filter((id:string) => id !== relatedPatientId)
        }
      })
    }
  }, [onUpdateViewAccess, selectedDocument])

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc._id}>
              <TableCell className="max-w-24 overflow-hidden font-medium whitespace-nowrap">{doc.doctor}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell className="max-w-10 whitespace-nowrap overflow-hidden">{doc.details}</TableCell>
              <TableCell>
                    <span
                      className={`
                      ${doc.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                      ${doc.status === "processing" ? "bg-orange-100 text-orange-700" : ""}
                      ${doc.status === "confirmed" ? "bg-green-100 text-green-700" : ""}
                      ${doc.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                      p-0.5 px-4 rounded-full text-center mx-auto
                    `}
                    >
                      {doc.status}
                    </span>
                  </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => window.open(doc.fileUrl, '_blank')}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Document
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {doc.patientId === loggedInPatientId && (
                      <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Manage Access
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDocument && (
        <AccessControlDialog
          document={selectedDocument}
          relationships={filteredRelations}
          onClose={() => setSelectedDocument(null)}
          onUpdateViewAccess={handleUpdateViewAccess}
        />
      )}
    </div>
  )
}
