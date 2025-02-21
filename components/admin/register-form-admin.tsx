"use client";

import { Icons } from "@/components/signup/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth_url } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isArray } from "util";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setTokens, setUserData } from "@/store/authSlice";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    namespace: "",
    type: 'user',
    image: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log(formData);
      const response = await fetch(`${auth_url}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (typeof data.message === "string") {
          toast.warning(data.message);
        } else if (isArray(data.message)) {
          data.message.forEach((msg: string) => {
            const capitalizedMessage =
              msg.charAt(0).toUpperCase() + msg.slice(1);
            toast.warning(capitalizedMessage);
          });
        }
        return;
      }
      toast.success(data.message);
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.warning(
        error.message || "Failed to create an account. Please try again."
      );
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold tracking-tight ">
          Create your Account
        </h1>
        <p className="text-sm text-gray-600">Start your website in seconds.</p>
      </div>
      <motion.form onSubmit={onSubmit} className="space-y-4" layout>
        <motion.div className="grid grid-cols-2 gap-4" layout>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-600">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Bonnie Green"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              className="bg-[#2D0066] border-gray-700 text-white"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
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
          </div>
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
    
        {/* <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              className="mt-1 border-gray-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-600 font-normal"
            >
              By signing up, you are creating a Flowbite account, and you agree
              to Flowbite's{" "}
              <Link href="#" className="text-blue-500 hover:text-blue-400">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-500 hover:text-blue-400">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="updates"
              className="mt-1 border-gray-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor="updates"
              className="text-sm text-gray-600 font-normal"
            >
              Email me about product updates and resources.
            </Label>
          </div>
        </div> */}
        <Button
          disabled={isLoading}
          className="w-full bg-[#4600a0] hover:bg-[#2D0066]"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create an account
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
