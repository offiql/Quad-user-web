"use client";

import Sidebar from "@/components/sidebar";
import { getUserData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { setPatientData } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPatientDetails = async () => {
      const user = getUserData();
      try {
        const userResponse = await fetch(`${backend_url}/patient/check-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            email: user?.email,
          }),
        });

        const userExists = await userResponse.json();

        if (userExists.exists) {
          console.log(userExists.patient);
          dispatch(setPatientData(userExists.patient));
        } else {
          router.push("/personal-details"); // Redirect to the form page
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