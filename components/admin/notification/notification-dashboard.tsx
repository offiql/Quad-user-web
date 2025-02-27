"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationDialog } from "@/components/admin/notification/notification-dialog";
import { NotificationGrid } from "@/components/admin/notification/notification-grid";
import { SendNotificationDialog } from "@/components/admin/notification/send-notification-dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Notification,
  NotificationType,
  Patient,
} from "@/components/types/patient";
import { getPatients } from "@/app/actions/patients";
import { getAccessToken } from "@/lib/getTokens";
import { getAllTemplates, saveNotification } from "@/app/actions/notifications";

export function NotificationDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  // const [notifications, setNotifications] = useState<Notification[]>([
  //   {
  //     _id: "1",
  //     title: "System Maintenance Alert",
  //     message:
  //       "The system will be down for scheduled maintenance. Please save your work.",
  //     type: "once",
  //     sendType: "system",
  //     createdAt: new Date(Date.now() - 86400000),
  //     lastUsed: new Date(Date.now() - 43200000),
  //   },
  //   {
  //     _id: "2",
  //     title: "Daily Stand-up Reminder",
  //     message: "Don't forget to join the daily stand-up meeting at 10 AM.",
  //     type: "daily",
  //     sendType: "system",
  //     createdAt: new Date(Date.now() - 172800000),
  //     lastUsed: new Date(Date.now() - 86400000),
  //   },
  //   {
  //     _id: "3",
  //     title: "Weekly Progress Report",
  //     message: "Please submit your weekly progress report by Friday EOD.",
  //     type: "weekly",
  //     sendType: "system",
  //     createdAt: new Date(Date.now() - 432000000),
  //   },
  // ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = getAccessToken();
        if (!access_token) throw new Error("Access token is missing");

        const [patientsResponse, notificationResponse] = await Promise.all([
          getPatients(access_token),
          getAllTemplates(access_token),
        ]);

        if (patientsResponse?.patients) {
          setPatients(patientsResponse.patients);
        }

        if (notificationResponse?.data) {
          setNotifications(notificationResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error ? error.message : "An error has occurred!"
        );
      }
    };

    fetchData();
  }, []);

  const handleSaveNotification = async (data: {
    title: string;
    message: string;
    type: NotificationType;
  }) => {
    if (editingNotification) {
      // Update existing notification
      setNotifications(
        notifications.map((n) =>
          n._id === editingNotification._id ? { ...n, ...data } : n
        )
      );
      toast.success("Notification template updated successfully");
    } else {
      // Create new notification
      const access_token = getAccessToken();
      const newNotification: Notification = {
        ...data,
        sendType: "system",
        createdAt: new Date(),
      };
      const notification = await saveNotification(
        newNotification,
        access_token
      );
      if (notification !== null) {
        setNotifications([newNotification, ...notifications]);
        toast.success("Notification template created successfully!");
      } else {
        toast.error("Failed to create notification template!");
      }
    }

    setIsCreateDialogOpen(false);
    setEditingNotification(null);
  };

  const handleSendNotification = (
    notificationId?: string,
    recipients?: Patient[]
  ) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (!notification) return;
    const recipientsIds = recipients?.map((patient) => {
      return patient._id;
    });
    console.log(recipientsIds);
    // Update last used timestamp
    setNotifications(
      notifications.map((n) =>
        n._id === notificationId ? { ...n, lastUsed: new Date() } : n
      )
    );

    setIsSendDialogOpen(false);
    setSelectedNotification(null);

    const message =
      notification.type === "once"
        ? `Notification sent to ${recipients?.length} users`
        : `${
            notification.type.charAt(0).toUpperCase() +
            notification.type.slice(1)
          } notification scheduled`;

    toast.success(message);
  };

  const handleUseTemplate = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsSendDialogOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteNotification = (notification: Notification) => {
    setNotifications(notifications.filter((n) => n._id !== notification._id));
    toast.success("Notification template deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Notification Templates</h2>
          <p className="text-muted-foreground">
            Create and manage notification templates
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingNotification(null);
            setIsCreateDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>
            Select a template to send a notification or schedule recurring
            notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationGrid
            notifications={notifications}
            onUseTemplate={handleUseTemplate}
            onEditNotification={handleEditNotification}
            onDeleteNotification={handleDeleteNotification}
          />
        </CardContent>
      </Card>

      <NotificationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveNotification}
        defaultValues={
          editingNotification
            ? {
                title: editingNotification.title,
                message: editingNotification.message,
                type: editingNotification.type,
              }
            : undefined
        }
        mode={editingNotification ? "edit" : "create"}
      />

      {selectedNotification && (
        <SendNotificationDialog
          patients={patients}
          open={isSendDialogOpen}
          onOpenChange={setIsSendDialogOpen}
          notification={selectedNotification}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
}
