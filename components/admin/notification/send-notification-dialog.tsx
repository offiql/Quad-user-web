"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Bell, Users } from "lucide-react"
import { UserSelectionDialog } from "@/components/admin/notification/user-selection-dialog"
import { Patient, NotificationType, Notification } from "@/components/types/patient"
import { toast } from "sonner"

interface SendNotificationDialogProps {
  open: boolean
  patients: Patient[]
  onOpenChange: (open: boolean) => void
  notification: Notification
  onSend: (notificationId?: string, recipients?: Patient[]) => void
}

export function SendNotificationDialog({ open, patients , onOpenChange, notification, onSend }: SendNotificationDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<Patient[]>([])
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (notification.type === "once" && selectedUsers.length === 0) {
      toast.info("Please select at least one user for one-time notifications")
      return
    }

    onSend(notification._id, notification.type === "once" ? selectedUsers : undefined)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset selected users when dialog is closed
      setSelectedUsers([])
    }
    onOpenChange(open)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {notification.type === "once" ? "Send Notification" : "Schedule Notification"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <Label>Template</Label>
                <Badge variant="outline" className="text-xs capitalize">
                  {notification.type}
                </Badge>
              </div>
              <div className="p-4 border rounded-md bg-muted/30">
                <h3 className="font-medium mb-2">{notification.title}</h3>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </div>

            {notification.type === "once" ? (
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                  {selectedUsers.length > 0 ? (
                    selectedUsers.map((user) => (
                      <Badge key={user._id} variant="secondary" className="text-sm">
                       {`${user.firstName} ${user.lastName}`}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No users selected</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 flex items-center gap-2"
                  onClick={() => setIsUserDialogOpen(true)}
                >
                  <Users className="h-4 w-4" />
                  Select Users
                </Button>
              </div>
            ) : (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  This is a {notification.type} notification. It will be automatically sent to all relevant users based
                  on the schedule.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{notification.type === "once" ? "Send Now" : "Schedule"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {notification.type === "once" && (
        <UserSelectionDialog
          open={isUserDialogOpen}
          onOpenChange={setIsUserDialogOpen}
          users={patients}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
        />
      )}
    </>
  )
}

