"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import Stepper from "./stepper";

interface DocumentDetailsStepProps {
  loader: boolean;
  onNext: (details: any) => void;
  onBack: () => void;
}

export default function DocumentDetailsStep({
  loader,
  onNext,
  onBack,
}: DocumentDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const details = Object.fromEntries(formData);
    onNext(details);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Stepper currentStep={1} steps={["Upload Documents", "Fill Details"]} />

      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="doctor" className="mx-auto md:mx-0">
              Doctor's Name
            </Label>
            <Input
              id="doctor"
              name="doctor"
              className="max-w-80 mx-auto md:mx-0"
              placeholder="Write Doctor's name here"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="date" className="mx-auto md:mx-0">
              Reports Received Date
            </Label>
            <Input
              id="date"
              name="date"
              className="w-fit mx-auto md:mx-0"
              type="date"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="type" className="mx-auto md:mx-0">
              Report Type
            </Label>
            <Select name="type">
              <SelectTrigger className="max-w-80 mx-auto md:mx-0">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent className="max-w-80 mx-auto md:mx-0">
                <SelectItem value="Chest X-ray">Chest X-ray</SelectItem>
                <SelectItem value="Blood Test">Blood Test</SelectItem>
                <SelectItem value="MRI Scan">MRI Scan</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="visit" className="mx-auto md:mx-0">
              Last Visit
            </Label>
            <Input
              id="visit"
              name="visit"
              className="w-fit mx-auto md:mx-0"
              type="date"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="summary" className="mx-auto md:mx-0">
              Summary
            </Label>
            <Textarea
              id="summary"
              className="max-w-80 mx-auto md:mx-0"
              name="summary"
              placeholder="Fever, Headache, etc."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between item-center  w-full">
            <Label htmlFor="details" className="mx-auto md:mx-0">
              Other Details
            </Label>
            <Textarea
              id="details"
              className="max-w-80 mx-auto md:mx-0"
              name="details"
              placeholder="Any additional notes"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button disabled={loader} type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
