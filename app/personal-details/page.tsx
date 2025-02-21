"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken, getUserData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { setPatientData } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  userId: string;
  type:string;
}

export default function PersonalDetails() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Male",
    height: "",
    weight: "",
    bloodGroup: "A+",
    isDiabetic: "No",
    hasBloodPressure: "No",
    healthGoals: "",
    userId: "",
    email: "",
    district: "",
    state: "",
    country: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const user = getUserData();
    setUserData(user);
    if (user && user.name && user.userId) {
      const nameParts = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts[nameParts.length - 1] || "",
        middleName: nameParts.slice(1, -1).join(" ") || "",
        userId: user.userId,
        email: user.email,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const access_token = getAccessToken();
      const response = await fetch(`${backend_url}/patient/save-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Details saved successfully!");
        dispatch(setPatientData(data));
        console.log(userData)
        if(userData?.type==="admin"){
          router.push("/admin/dashboard");
        }else if(userData?.type==="team")
          router.push("/team/dashboard")
        else router.push("/dashboard")
      } else {
        toast.error("Failed to save details");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-screen relative z-50 flex items-center justify-center p-4">
      <div className="absolute w-full h-56 z-0 bottom-0 bg-gradient-to-b from-[#5D00A9] to-[#250043]"></div>
      <Card className="w-full max-w-2xl overflow-hidden relative">
        <CardContent className="p-8  max-h-[calc(100dvh-80px)] overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-[#4B0099]">Quad</h1>
              <h2 className="text-xl font-medium">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-gray-600">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-sm text-gray-600">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-gray-600">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm text-gray-600">
                  Date of birth
                </Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm text-gray-600">
                  Gender
                </Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className="rounded-md border-gray-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm text-gray-600">
                  Blood Group
                </Label>
                <Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    handleSelectChange("bloodGroup", value)
                  }
                >
                  <SelectTrigger className="rounded-md border-gray-200">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A +ve</SelectItem>
                    <SelectItem value="A-">A -ve</SelectItem>
                    <SelectItem value="B+">B +ve</SelectItem>
                    <SelectItem value="B-">B -ve</SelectItem>
                    <SelectItem value="O+">O +ve</SelectItem>
                    <SelectItem value="O-">O -ve</SelectItem>
                    <SelectItem value="AB+">AB +ve</SelectItem>
                    <SelectItem value="AB-">AB -ve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm text-gray-600">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm text-gray-600">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-gray-600">
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm text-gray-600">
                  District
                </Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm text-gray-600">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm text-gray-600">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="rounded-md border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isDiabetic" className="text-sm text-gray-600">
                  Are you diabetic ?
                </Label>
                <Select
                  name="isDiabetic"
                  value={formData.isDiabetic}
                  onValueChange={(value) =>
                    handleSelectChange("isDiabetic", value)
                  }
                >
                  <SelectTrigger className="rounded-md border-gray-200">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="hasBloodPressure"
                  className="text-sm text-gray-600"
                >
                  Do you have Blood Pressure issue ?
                </Label>
                <Select
                  name="hasBloodPressure"
                  value={formData.hasBloodPressure}
                  onValueChange={(value) =>
                    handleSelectChange("hasBloodPressure", value)
                  }
                >
                  <SelectTrigger className="rounded-md border-gray-200">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm text-gray-600">
                Address (optional)
              </Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your address..."
                value={formData.address}
                onChange={handleChange}
                className="rounded-md border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthGoals" className="text-sm text-gray-600">
                What are your health goals ?
              </Label>
              <Textarea
                id="healthGoals"
                name="healthGoals"
                placeholder="Write here..."
                value={formData.healthGoals}
                onChange={handleChange}
                className="min-h-[100px] rounded-md border-gray-200"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-[#4B0099] hover:bg-[#2D0066] text-white px-12"
              >
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
