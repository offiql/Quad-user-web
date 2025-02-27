export interface Allergy {
  allergen: string;
  impact: string;
}

export interface InsuranceDetails {
  insuranceName: string;
  insurancePolicyNumber: string;
  insurancePolicyType: "Cashless" | "Reimbursement";
  phone: string;
  helpdeskEmail: string;
}

export interface Patient {
  _id: string;
  userId: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  bloodGroup: string;
  isDiabetic: string;
  hasBloodPressure: string;
  district: string;
  state: string;
  country: string;
  address?: string;
  pincode?: string;
  phone?: string;
  image: string;
  healthGoals: string;
  allergies: Allergy[];
  insuranceDetails: InsuranceDetails[];
  emergency: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
}

export interface Relation {
  _id: string;
  requester: FamilyMember;
  responder: FamilyMember;
  requesterRelation: string;
  responderRelation: string;
  relationshipDetails?: string;
  canViewPeriodsData: "Yes" | "No";
  status: string;
}

export interface CycleData {
  startDate: Date;
  endDate: Date;
  type: "actual" | "predicted";
}

export interface PeriodTrackerProps {
  initialDate?: Date;
  cycles?: CycleData[];
}

export interface DocumentDetails {
  _id: string;
  doctor: string;
  date: string;
  type: string;
  status: string;
  visit: string;
  summary: string;
  details: string;
  patientId: string;
  fileUrl: string;
  fileKey: string;
  canViewPatients: string[];
}

export type NotificationType = "once" | "daily" | "weekly" | "monthly";

export type Notification = {
  _id?: string;
  title: string;
  message: string;
  sendType: string;
  type: NotificationType;
  createdAt: Date;
  lastUsed?: Date;
};