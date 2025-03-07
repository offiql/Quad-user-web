"use client";

import Sidebar from "@/components/sidebar";
import { getUserData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { setPatientData } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addNotification } from "@/store/notificationSlice";
import { generateToken } from "@/lib/firebase";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Fetch patient details
  useEffect(() => {
    const getPatientDetails = async () => {
      const user = getUserData();
      if (!user) {
        router.push("/personal-details");
        return;
      }

      try {
        const fcm_token = await generateToken();
        const userResponse = await fetch(`${backend_url}/patient/check-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.userId,
            email: user?.email,
            fcm_token: fcm_token ?? "",
          }),
        });

        const userExists = await userResponse.json();
        if (userExists.exists) {
          dispatch(setPatientData(userExists.patient));
          setPatientId(userExists.patient._id);
        } else {
          router.push("/personal-details");
        }
      } catch (error) {
        console.error("Error while fetching token: ", error);
        toast.error("Error fetching patient data!");
      } finally {
        setIsLoading(false);
      }
    };

    getPatientDetails();
  }, [dispatch, router]);

  // Handle socket connection separately
  useEffect(() => {
    if (!patientId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    // Ensure only one event listener is set
    socket.off("newNotification");
    socket.on("newNotification", (notification) => {
      toast.info(notification.message);
      dispatch(addNotification(notification));
      console.log("New Notification:", notification);
    });

    socket.emit("subscribe", patientId);

    return () => {
      socket.off("newNotification");
      disconnectSocket();
    };
  }, [patientId]); // Run only when patientId is available

  if (isLoading) {
    return (
      <div
        className="h-dvh w-dvw fixed inset-0 bg-gradient-to-b from-[#4B0099] to-[#2D0066] flex items-center justify-center"
        role="status"
        aria-label="Loading"
      >
        <div className="text-white text-center">
          <h1 className="text-4xl font-medium mb-1">Quad</h1>
          <p className="text-sm tracking-[0.2em] uppercase">Health</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-grow h-dvh hide-scrollbar w-full overflow-y-auto overflow-hidden">
      <Sidebar />
      <section className="w-full h-full">{children}</section>
    </main>
  );
}
