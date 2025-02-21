"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
const PendingCheckups = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % checkups.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + checkups.length) % checkups.length);
  };
  return (
    <div className="space-y-4 pb-3">
      <h3 className="font-semibold">Pending Checkup</h3>
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
                currentSlide === index ? "w-4 bg-primary" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingCheckups;
