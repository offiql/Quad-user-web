"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { auth_url, backend_url } from "@/lib/utils"; // Ensure backend_url is defined here
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setPatientData, setTokens, setUserData } from "@/store/authSlice";

export default function CallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleTokenRequest(code);
    } else {
      setIsLoading(false);
      setError("No authorization code found");
    }
  }, [searchParams]);

  const handleTokenRequest = async (authCode: string) => {
    const client_id = "0a29e4ddcac85de100e6b3a9e416a32b";
    const client_secret =
      "34b025e3dd57f8e514a9da582cfde50e34e3642e7f769d7a834f832c7b17370c";
    const body = new URLSearchParams({
      client_id,
      client_secret,
      code: authCode,
      grant_type: "authorization_code",
    });

    try {
      const response = await fetch(`${auth_url}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error_description || "Failed to get the token");
      }

      const { access_token, refresh_token } = data;
      const decodedToken: any = jwtDecode(access_token);
      dispatch(setTokens({ access_token, refresh_token }));
      dispatch(setUserData(decodedToken));

      toast.success("Token received successfully!");

      // Check if user exists in backend
      const userResponse = await fetch(`${backend_url}/patient/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: decodedToken?.userId,
          email: decodedToken?.email,
        }),
      });

      const userExists = await userResponse.json();

      if (userExists.exists) {
        console.log(userExists.patient);
        dispatch(setPatientData(userExists.patient));
        if(decodedToken?.type==="admin"){
          router.push("/admin/dashboard");
        }
        else router.push("/dashboard")
      } else {
        router.push("/personal-details"); // Redirect to the form page
      }
    } catch (error) {
      console.error("Error while fetching token: ", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch the token."
      );
      toast.error("Error fetching token.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-[#4B0099] to-[#2D0066] flex items-center justify-center"
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#4B0099] to-[#2D0066]">
        <div className="text-white text-center">
          <h1 className="text-4xl font-medium mb-4">Error</h1>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  } else
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-[#4B0099] to-[#2D0066] flex items-center justify-center"
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
