"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getpatientData } from "@/lib/getTokens";
import React from "react";
import { toast } from "sonner";
import { backend_url } from "@/lib/utils";

const NotificationComponent = () => {
  const [socket, setSocket] = useState<any>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    const patient = getpatientData();
    if (patient?._id) {
      setPatientId(patient._id);

      // Establish a new socket connection
      const newSocket = io(backend_url, {
        transports: ["websocket"], // Prevents polling issues
        reconnection: true,
      });

      setSocket(newSocket);

      // Subscribe to notifications
      newSocket.emit("subscribe", patient._id);

      newSocket.on("newNotification", (notification) => {
        toast.info(notification.message);
        console.log("New Notification:", notification);
      });

      // Cleanup function
      return () => {
        newSocket.off("newNotification");
        newSocket.disconnect();
      };
    }
  }, []);

  return <div>Listening for notifications...</div>;
};

export default NotificationComponent;
