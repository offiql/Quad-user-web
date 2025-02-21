"use client";

import { Icons } from "@/components/signup/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth_url, backend_url } from "@/lib/utils";
import { setPatientData, setTokens, setUserData } from "@/store/authSlice";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import { getUserData } from "@/lib/getTokens";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${auth_url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        toast.warning(data.message);
        return;
      }

      if (data.userId) {
        setUserId(data.userId);
        toast.success("OTP sent to your email. Please verify to proceed.");
      } else if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        handleLoginSuccess(data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.warning("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${auth_url}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (data.error) {
        toast.warning(data.message);
        return;
      }
      if (data.redirectUrl) {
        // Redirect to the URL if it is provided
        router.push(data.redirectUrl);
      } else {
        handleLoginSuccess(data);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.warning("OTP verification failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoginSuccess(data: any) {
    const { access_token, refresh_token } = data;
    const userData: any = jwtDecode(access_token);
    dispatch(setTokens({ access_token, refresh_token }));
    dispatch(setUserData(userData));
    toast.success("Log In Successful!");
    // Check if user exists in backend
    const userResponse = await fetch(`${backend_url}/patient/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userData?.userId,
        email: userData?.email,
      }),
    });

    const userExists = await userResponse.json();

    if (userExists.exists) {
      console.log(userExists.patient);
      dispatch(setPatientData(userExists.patient));
      if (userData?.type === "admin") {
        router.push("/admin/dashboard");
      } else router.push("/admin");
    } else {
      router.push("/personal-details"); // Redirect to the form page
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to your Account
        </h1>
        <p className="text-sm text-gray-600">
          Welcome back! Please enter your details.
        </p>
      </div>
      <motion.form
        onSubmit={userId ? verifyOtp : onSubmit}
        className="space-y-4"
        layout
      >
        {!userId ? (
          <>
            <motion.div className="space-y-2" layout>
              <Label htmlFor="email" className="text-gray-600">
                Your email
              </Label>
              <Input
                id="email"
                placeholder="name@company.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-[#2D0066] border-gray-700 text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div className="space-y-2" layout>
              <Label htmlFor="password" className="text-gray-600">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  className="bg-[#2D0066] border-gray-700 text-white pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div className="space-y-2" layout>
            <Label htmlFor="otp" className="text-gray-600">
              Enter OTP
            </Label>
            <Input
              id="otp"
              placeholder="Enter your OTP"
              type="text"
              disabled={isLoading}
              className="bg-[#2D0066] border-gray-700 text-white"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </motion.div>
        )}
        <Button
          disabled={isLoading}
          className="w-full bg-[#4600a0] hover:bg-[#2D0066]"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {userId ? "Verify OTP" : "Sign In"}
        </Button>
        <Link
          href="/forgot-password"
          className="block text-center text-sm text-[#4600a0] hover:text-[#2D0066] hover:underline mt-4"
        >
          Forgot password?
        </Link>
      </motion.form>
    </div>
  );
}
