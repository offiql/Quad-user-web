"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { setPatientData } from "@/store/authSlice";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import type {
  Allergy,
  InsuranceDetails,
  Patient,
  Relation,
  FamilyMember,
} from "../types/patient";
import { FaSpinner } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function PatientProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<Relation[]>([]);

  const [formData, setFormData] = useState<Patient>({
    _id: "",
    userId: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    height: 0,
    weight: 0,
    bloodGroup: "",
    isDiabetic: "No",
    hasBloodPressure: "No",
    district: "",
    state: "",
    country: "",
    address: "",
    pincode: "",
    phone: "",
    image: "",
    healthGoals: "",
    allergies: [],
    insuranceDetails: [],
    emergency: "",
  });
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAllergy = () => {
    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, { allergen: "", impact: "" }],
    }));
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const updateAllergy = (
    index: number,
    field: keyof Allergy,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.map((allergy, i) =>
        i === index ? { ...allergy, [field]: value } : allergy
      ),
    }));
  };

  const addInsurance = () => {
    setFormData((prev) => ({
      ...prev,
      insuranceDetails: [
        ...prev.insuranceDetails,
        {
          insuranceName: "",
          insurancePolicyNumber: "",
          insurancePolicyType: "Cashless",
          phone: "",
          helpdeskEmail: "",
        },
      ],
    }));
  };

  const removeInsurance = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      insuranceDetails: prev.insuranceDetails.filter((_, i) => i !== index),
    }));
  };

  const updateInsurance = (
    index: number,
    field: keyof InsuranceDetails,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      insuranceDetails: prev.insuranceDetails.map((insurance, i) =>
        i === index ? { ...insurance, [field]: value } : insurance
      ),
    }));
  };

  const fetchRelations = async () => {
    const access_token = getAccessToken();
    try {
      const response = await fetch(`${backend_url}/patient/get-relations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch relations");
        return;
      }

      const data = await response.json();
      // console.log(data);
      setFamilyMembers(data);
    } catch (error) {
      toast.error("Error fetching relations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setIsSubmitting(true);
    try {
      const access_token = getAccessToken();
      const response = await fetch(`${backend_url}/patient/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update patient data");
      }

      const updatedPatient = await response.json();
      dispatch(setPatientData(updatedPatient));
      toast.success("Patient data updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating patient data:", error);
      toast.error("Failed to update patient data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const patient = getpatientData();
    setFormData(patient);
    fetchRelations();
  }, []);

  const getEmergencyContact = () => {
    const emergencyContact = familyMembers.find(
      (member) =>
        member.responder.id === formData.emergency ||
        member.requester.id === formData.emergency
    );

    return emergencyContact
      ? {
          name:
            emergencyContact.responder.id === formData.emergency
              ? emergencyContact.responder.name
              : emergencyContact.requester.name,
          phone:
            emergencyContact.responder.id === formData.emergency
              ? emergencyContact.responder.phone
              : emergencyContact.requester.phone,
          email:
            emergencyContact.responder.id === formData.emergency
              ? emergencyContact.responder.email
              : emergencyContact.requester.email,
        }
      : { name: "Not set", phone: "Not set", email: "Not set" };
  };

  const emergencyContactDetails = getEmergencyContact();

  return (
    <div className="p-4">
      {!isEditing ? (
        <div className="border-none p-0 m-0">
          <div className="px-4 md:p-4">
            <div className="flex flex-row justify-between items-start md:items-center md:mb-8">
              <h1 className="text-2xl text-[#112449] font-bold mb-4 md:mb-0">
                Personal Detail
              </h1>
              <Button
                onClick={() => setIsEditing(true)}
                className=" text-white bg-[#520190] hover:bg-[#3B0764]"
                size="sm"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
              {formData.image === "" ? (
                <div className="w-32 h-32 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-semibold shrink-0">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </div>
              ) : (
                <Avatar className="w-32 h-32">
                  <AvatarImage src={formData.image} alt="@shadcn" />
                  <AvatarFallback className="flex items-center justify-center text-2xl font-semibold shrink-0">
                    {formData.firstName?.[0]}
                    {formData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex gap-2">
                        <span className="text-gray-900 font-medium min-w-[100px]">
                          Address:
                        </span>
                        {formData.address}
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-900 font-medium min-w-[100px]">
                          Email:
                        </span>
                        {formData.email}
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-900 font-medium min-w-[100px]">
                          Phone:
                        </span>
                        {formData.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">DOB</p>
                          <p className="font-medium">{formData.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blood Group</p>
                          <p className="font-medium">{formData.bloodGroup}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Allergies</p>
                          <p className="font-medium">
                            {formData.allergies
                              .map((a) => a.allergen)
                              .join(", ") || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-4">
                <h3 className="font-bold mb-2 text-2xl text-[#112449]">
                  Basic Details
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Height: {formData.height} cm</p>
                  <p>Weight: {formData.weight} kg</p>
                  <p>Diabetic: {formData.isDiabetic}</p>
                  <p>Blood Pressure: {formData.hasBloodPressure}</p>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="font-bold mb-2 text-2xl text-[#112449]">
                  Emergency Contact
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Name: {emergencyContactDetails.name}</p>
                  <p>Phone: {emergencyContactDetails.phone}</p>
                  <p>Email: {emergencyContactDetails.email}</p>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold mb-2 text-2xl text-[#112449]">
                  Insurance
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {formData.insuranceDetails.length > 0 ? (
                    <>
                      <p>
                        Provider: {formData.insuranceDetails[0].insuranceName}
                      </p>
                      <p>
                        Policy:{" "}
                        {formData.insuranceDetails[0].insurancePolicyNumber}
                      </p>
                      <p>
                        Type: {formData.insuranceDetails[0].insurancePolicyType}
                      </p>
                    </>
                  ) : (
                    <p>No insurance details available</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className=" space-y-8 ">
          <Card>
            <CardHeader className="flex md:flex-row md:justify-between md:items-center">
              <CardTitle className="text-2xl font-bold text-[#112449]">
                Personal Information
              </CardTitle>
              <div className="flex md:justify-end gap-4">
                <Button
                  type="button"
                  className="hover:text-white hover:bg-[#3B0764]"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#520190] text-white hover:bg-[#3B0764]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      handleSelectChange("bloodGroup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isDiabetic">Diabetic</Label>
                  <Select
                    value={formData.isDiabetic}
                    onValueChange={(value) =>
                      handleSelectChange("isDiabetic", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hasBloodPressure">Blood Pressure</Label>
                  <Select
                    value={formData.hasBloodPressure}
                    onValueChange={(value) =>
                      handleSelectChange("hasBloodPressure", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#112449]">
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:flex w-full">
                <div className="md:w-1/4">
                  {" "}
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Select
                    value={formData.emergency}
                    onValueChange={(value) =>
                      handleSelectChange("emergency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency contact" />
                    </SelectTrigger>
                    <SelectContent className="w-fit">
                      {familyMembers.map((member) => {
                        const unique =
                          member.responder.id === formData._id
                            ? member.requester
                            : member.responder;
                        return (
                          <SelectItem key={unique.id} value={unique.id}>
                            {unique.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="text-sm px-5 my-auto w-3/4 mx-auto flex items-center justify-between text-gray-600 gap-4">
                  <p>Name: {emergencyContactDetails.name}</p>
                  <p>Phone: {emergencyContactDetails.phone}</p>
                  <p>Email: {emergencyContactDetails.email}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#112449] font-bold">
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-2xl text-[#112449] font-bold">
                <span>Allergies</span>
                <Button type="button" variant="outline" onClick={addAllergy}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allergy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {formData.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label>Allergen</Label>
                    <Input
                      value={allergy.allergen}
                      onChange={(e) =>
                        updateAllergy(index, "allergen", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label>Impact</Label>
                    <div className="flex gap-2">
                      <Input
                        value={allergy.impact}
                        onChange={(e) =>
                          updateAllergy(index, "impact", e.target.value)
                        }
                      />{" "}
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeAllergy(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-2xl text-[#112449] font-bold">
                <span>Insurance Details</span>
                <Button type="button" variant="outline" onClick={addInsurance}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Insurance
                </Button>{" "}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {formData.insuranceDetails.map((insurance, index) => (
                <div
                  key={index}
                  className="grid gap-4 border p-4 rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => removeInsurance(index)}
                  >
                    {" "}
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Insurance Name</Label>
                      <Input
                        value={insurance.insuranceName}
                        onChange={(e) =>
                          updateInsurance(
                            index,
                            "insuranceName",
                            e.target.value
                          )
                        }
                      />
                    </div>{" "}
                    <div className="space-y-2">
                      <Label>Policy Number</Label>
                      <Input
                        value={insurance.insurancePolicyNumber}
                        onChange={(e) =>
                          updateInsurance(
                            index,
                            "insurancePolicyNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Policy Type</Label>
                      <Select
                        value={insurance.insurancePolicyType}
                        onValueChange={(value) =>
                          updateInsurance(index, "insurancePolicyType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cashless">Cashless</SelectItem>
                          <SelectItem value="Reimbursement">
                            Reimbursement
                          </SelectItem>
                        </SelectContent>
                      </Select>{" "}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={insurance.phone}
                        onChange={(e) =>
                          updateInsurance(index, "phone", e.target.value)
                        }
                      />
                    </div>{" "}
                    <div className="space-y-2">
                      <Label>Helpdesk Email</Label>
                      <Input
                        type="email"
                        value={insurance.helpdeskEmail}
                        onChange={(e) =>
                          updateInsurance(
                            index,
                            "helpdeskEmail",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
