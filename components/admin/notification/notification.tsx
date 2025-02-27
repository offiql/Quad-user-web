"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserSelectionDialog } from "@/components/admin/notification/user-selection-dialog";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { Patient } from "@/components/types/patient";


export function Notifications({ patients }: { patients: Patient[] }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("Please fill in all notification fields");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.info("Please select at least one user");
      return;
    }

    // In a real app, this would send the notification to the selected users
    console.log({
      notification: { title, message },
      recipients: selectedUsers.map((user) => user._id),
    });

    toast.success(`Notification sent to ${selectedUsers.length} users`);

    // Reset form
    setTitle("");
    setMessage("");
    setSelectedUsers([]);
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Create Custom Notification
          </CardTitle>
          <CardDescription>
            Compose a notification and select users to receive it
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notification message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => (
                    <Badge
                      key={user._id}
                      variant="secondary"
                      className="text-sm"
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No users selected
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => setIsDialogOpen(true)}
              >
                Select Users
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Send Notification</Button>
          </CardFooter>
        </form>
      </Card>

      <UserSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        users={patients}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
      />
    </>
  );
}
