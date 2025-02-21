"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Patient, Relation } from "../types/patient";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import HealthRelationMonitoring from "./relationMonitor";
import PeriodTracker from "./periods-tracker";

export default function RelationProfile({
  familyMembers,
}: {
  familyMembers: Relation[];
}) {
  const [patient, setPatient] = useState<Patient>();
  const [selectedRelation, setSelectedRelation] = useState<Relation | null>(
    null
  );
  const [relationProfileDetails, setRelationProfileDetails] =
    useState<Patient>();

  useEffect(() => {
    const patient = getpatientData();
    setPatient(patient);
  }, []);

  const getRelationProfileDetails = async (relationId: string) => {
    try {
      const access_token = getAccessToken();
      const response = await fetch(
        `${backend_url}/patient/get-relation-profile-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ patientId: patient?._id, relationId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch relation profile details");
      }
      const data = await response.json();
      setRelationProfileDetails(data);
    } catch (error) {
      console.error("Error fetching relation profile details:", error);
    }
  };

  const handleRelationSelect = (relation: Relation) => {
    setSelectedRelation(relation);
    getRelationProfileDetails(relation._id);
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl text-[#112449] pl-4 font-bold mb-4">Family Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 gap-4">
        {familyMembers.map((relation, index) => {
          const unique =
            relation.responder.id === patient?._id
              ? relation.requester
              : relation.responder;
          const isRequester = relation.requester.id === patient?._id;

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                selectedRelation?._id === relation._id
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => handleRelationSelect(relation)}
            >
              <CardContent className="p-4 flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${relation.responder.name}`}
                  />
                  <AvatarFallback>{unique.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-center">{unique.name}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {isRequester
                    ? relation.requesterRelation
                    : relation.responderRelation}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedRelation && relationProfileDetails && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Relation Profile Details</h3>
          {/* Display relation profile details here */}
          <form className=" space-y-8">
            <Card>
              <CardHeader className="flex md:flex-row md:justify-between md:items-center">
                <CardTitle className="text-2xl font-bold text-[#112449]">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={relationProfileDetails.firstName}
                      disabled={true}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={relationProfileDetails.middleName}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={relationProfileDetails.lastName}
                      disabled={true}
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
                      value={relationProfileDetails.email}
                      disabled={true}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={relationProfileDetails.phone}
                      disabled={true}
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
                      value={relationProfileDetails.dateOfBirth}
                      disabled={true}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={relationProfileDetails.gender}
                      disabled={true}
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
                      value={relationProfileDetails.bloodGroup}
                      disabled={true}
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
                      value={relationProfileDetails.height}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={relationProfileDetails.weight}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isDiabetic">Diabetic</Label>
                    <Select
                      value={relationProfileDetails.isDiabetic}
                      disabled={true}
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
                      value={relationProfileDetails.hasBloodPressure}
                      disabled={true}
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
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Select
                      value={relationProfileDetails.emergency}
                      disabled={true}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency contact" />
                      </SelectTrigger>
                      <SelectContent className="w-fit">
                        {familyMembers.map((member, index) => {
                          const unique =
                            member.responder.id === relationProfileDetails._id
                              ? member.requester
                              : member.responder;
                          return (
                            <SelectItem key={index} value={unique.id}>
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
                    value={relationProfileDetails.address}
                    disabled={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      name="district"
                      value={relationProfileDetails.district}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={relationProfileDetails.state}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={relationProfileDetails.country}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={relationProfileDetails.pincode}
                    disabled={true}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-2xl text-[#112449] font-bold">
                  <span>Allergies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {relationProfileDetails.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label>Allergen</Label>
                      <Input value={allergy.allergen} disabled={true} />
                    </div>
                    <div className="space-y-2 relative">
                      <Label>Impact</Label>
                      <div className="flex gap-2">
                        <Input value={allergy.impact} disabled={true} />
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
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {relationProfileDetails.insuranceDetails.map(
                  (insurance, index) => (
                    <div
                      key={index}
                      className="grid gap-4 border p-4 rounded-lg relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Insurance Name</Label>
                          <Input
                            value={insurance.insuranceName}
                            disabled={true}
                          />
                        </div>{" "}
                        <div className="space-y-2">
                          <Label>Policy Number</Label>
                          <Input
                            value={insurance.insurancePolicyNumber}
                            disabled={true}
                          />
                        </div>
                      </div>{" "}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Policy Type</Label>
                          <Select
                            value={insurance.insurancePolicyType}
                            disabled={true}
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
                          <Input value={insurance.phone} disabled={true} />
                        </div>{" "}
                        <div className="space-y-2">
                          <Label>Helpdesk Email</Label>
                          <Input
                            type="email"
                            value={insurance.helpdeskEmail}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </form>
          {relationProfileDetails && (
            <>
              <HealthRelationMonitoring
                relationProfileDetails={relationProfileDetails}
              />
              <PeriodTracker relationProfileDetails={relationProfileDetails} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
