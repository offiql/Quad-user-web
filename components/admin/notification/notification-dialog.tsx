"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell } from "lucide-react"
import type { NotificationType } from "@/components/types/patient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface NotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (notification: { title: string; message: string; type: NotificationType }) => void
  defaultValues?: {
    title: string
    message: string
    type: NotificationType
  }
  mode?: "create" | "edit"
}

export function NotificationDialog({
  open,
  onOpenChange,
  onSave,
  defaultValues,
  mode = "create",
}: NotificationDialogProps) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<NotificationType>("once")

  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title)
      setMessage(defaultValues.message)
      setType(defaultValues.type)
    }
  }, [defaultValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !message) {
      toast.success("Please fill in all notification fields")
      return
    }

    onSave({
      title,
      message,
      type,
    })

    // Reset form
    setTitle("")
    setMessage("")
    setType("once")
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog is closed
      setTitle("")
      setMessage("")
      setType("once")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[600px] sm:max-h-dvh">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {mode === "edit" ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title</Label>
            <Input
              id="title"
              placeholder="Enter template title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Notification Type</Label>
            <Select value={type} onValueChange={(value: NotificationType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter notification message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "edit" ? "Update Template" : "Save Template"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

