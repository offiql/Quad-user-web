"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Edit, MoreVertical, Send, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/components/types/patient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface NotificationGridProps {
  notifications: Notification[];
  onUseTemplate: (notification: Notification) => void;
  onEditNotification: (notification: Notification) => void;
  onDeleteNotification: (notification: Notification) => void;
}

const typeColors = {
  once: "default",
  daily: "blue",
  weekly: "green",
  monthly: "purple",
} as const;

export function NotificationGrid({
  notifications,
  onUseTemplate,
  onEditNotification,
  onDeleteNotification,
}: NotificationGridProps) {
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10">
        <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No templates yet</h3>
        <p className="text-muted-foreground">
          Create your first notification template to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notifications.map((notification, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {notification.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onUseTemplate(notification)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEditNotification(notification)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setNotificationToDelete(notification)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {notification.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {notification.message}
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <div className="flex items-center text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {notification.lastUsed
                    ? `Last used ${formatTimeAgo(notification.lastUsed)}`
                    : `Created ${formatTimeAgo(notification.createdAt)}`}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!notificationToDelete}
        onOpenChange={() => setNotificationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this notification template. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (notificationToDelete) {
                  onDeleteNotification(notificationToDelete);
                  setNotificationToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatTimeAgo(date: string | Date): string {
  // Convert string to Date if needed
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date"; // Handle invalid dates gracefully
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}

