import React, { useState, useEffect } from "react"
import type { DocumentDetails, Relation } from "../types/patient"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, UserMinus } from "lucide-react"

interface AccessControlDialogProps {
  document: DocumentDetails
  relationships: Relation[]
  onClose: () => void
  onUpdateViewAccess: (documentId: string, relatedPatientId: string, isGrant: boolean) => Promise<void>
}

export default function AccessControlDialog({
  document,
  relationships,
  onClose,
  onUpdateViewAccess,
}: AccessControlDialogProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setSelectedPatientId("")
  }, [])

  const handleUpdateAccess = async (isGrant: boolean) => {
    if (selectedPatientId) {
      setIsUpdating(true)
      await onUpdateViewAccess(document._id, selectedPatientId, isGrant)
      setIsUpdating(false)
    }
  }

  const hasAccess = document.canViewPatients.includes(selectedPatientId)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Document Access</DialogTitle>
          <DialogDescription>Control who can view this document.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a relation" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map((rel) => {
                const isRequester = rel.requester.id === document.patientId
                const relatedPerson = isRequester ? rel.responder : rel.requester
                return (
                  <SelectItem key={relatedPerson.id} value={relatedPerson.id}>
                    {`${relatedPerson.name} (${isRequester ? rel.requesterRelation : rel.responderRelation})`}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button
              variant={hasAccess ? "destructive" : "default"}
              onClick={() => handleUpdateAccess(!hasAccess)}
              disabled={!selectedPatientId || isUpdating}
            >
              {isUpdating ? (
                "Updating..."
              ) : hasAccess ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Revoke Access
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Access
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

