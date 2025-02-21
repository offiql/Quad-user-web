"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getUserData } from "@/lib/getTokens";

export default function WelcomeCard() {
  const user = getUserData();
  return (
    <div className="relative rounded-lg bg-[#3B0764] p-6 text-white">
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold">
          <span className="font-normal ">Hello</span> {user.name},
        </h2>
        <p className="mt-2 text-white/80 max-w-[450px]">
          Have a nice day and don't forget to take care of your health!
        </p>
        <Link
          href="/dashboard"
          className="mt-4 flex items-center text-green-500 hover:text-green-500 hover:bg-none"
        >
          Health Tips <ChevronRight />
        </Link>
      </div>
      <Image
        src="/images/yoga.png"
        alt="Meditation illustration"
        width={220}
        height={220}
        className="absolute w-[100px] h-[100px] md:w-[220px] md:h-[220px]  right-5 bottom-0"
      />
    </div>
  );
}
