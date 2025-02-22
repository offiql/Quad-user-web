"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getpatientData, getUserData } from "@/lib/getTokens";

// Sample checkup data
const checkups = [
  {
    id: 1,
    title: "Full body checkup",
    dueDate: "10th Oct, 2024",
  },
  {
    id: 2,
    title: "Dental checkup",
    dueDate: "15th Oct, 2024",
  },
  {
    id: 3,
    title: "Eye examination",
    dueDate: "20th Oct, 2024",
  },
];

export default function ProfileSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const user = getUserData();
  const patient = getpatientData();

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % checkups.length);
  };
  useEffect(() => {
    console.log(patient);
  }, [patient]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + checkups.length) % checkups.length);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        {patient.image === "" ? (
          <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-semibold shrink-0">
            {patient.firstName?.[0]}
            {patient.lastName?.[0]}
          </div>
        ) : (
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={patient.image} alt="@shadcn" />
            <AvatarFallback className="flex items-center justify-center text-2xl font-semibold shrink-0">
              {patient.firstName?.[0]}
              {patient.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <h2 className="text-xl font-semibold">{`${patient.firstName} ${patient.lastName}`}</h2>
        <p className="text-sm text-[#A3AED0] text-muted-foreground flex items-center justify-center gap-1">
          <span>{calculateAge(patient.dateOfBirth)} years old</span>
          <span>•</span>
          <span>{patient.district}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-[#A3AED0] ">
        <div>
          <p className="text-sm text-muted-foreground">Blood</p>
          <p className="font-semibold text-lg">{patient.bloodGroup}</p>{" "}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Height</p>
          <p className="font-semibold text-lg">{patient.height}cm</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Weight</p>
          <p className="font-semibold text-lg">{patient.weight}kg</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#59748A]">Pending Checkup</h3>
        <div className="relative bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={prevSlide}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Previous checkup"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div
              className="text-center transition-opacity duration-300 ease-in-out"
              key={checkups[currentSlide].id}
            >
              <p className="font-medium">{checkups[currentSlide].title}</p>
              <p className="text-sm text-muted-foreground">
                Due date : {checkups[currentSlide].dueDate}
              </p>
            </div>
            <button
              onClick={nextSlide}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Next checkup"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {/* Carousel indicators */}
          <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {checkups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <Link href="/upload-documents" className="text-sm text-primary block">
          <div className="flex items-center gap-2">
            <span className="underline text-[#112449]">
              Upload More Documents here
            </span>
            <ChevronRight />
          </div>
        </Link>
      </div>
    </div>
  );
}
