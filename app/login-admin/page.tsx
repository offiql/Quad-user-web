"use client";

import { Icons } from "@/components/signup/icons";
import LoginForm from "@/components/admin/login-form-admin";
import RegisterForm from "@/components/admin/register-form-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"] })

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-1 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 justify-center mb-6">
                {/* <Icons.logo className="w-8 h-8 text-blue-500" /> */}
                <span className={`text-3xl font-bold text-center tracking-widest ${urbanist.className}`}>
                  QUAD
                </span>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#4B0099]">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-[#2D0066]"
                  >
                    <span className="text-primary-foreground">Login</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-[#2D0066]"
                  >
                    <span className="text-primary-foreground">Register</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "login" ? (
                    <LoginForm />
                  ) : (
                    <RegisterForm />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <Image
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
            width={600}
            height={600}
            alt="Illustration"
            className="w-full"
          />
        </motion.div> */}
      </div>
    </div>
  );
}
