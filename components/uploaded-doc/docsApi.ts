import { backend_url } from "@/lib/utils";
import axios from "axios";

const API_BASE_URL = backend_url!; // Replace with actual backend URL

// Fetch documents for a patient
export const fetchDocuments = async (patientId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patient/doc/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

// Grant viewership permission to a related patient
export const grantViewAccess = async (
  documentId: string,
  viewerPatientId: string
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/patient/${documentId}/allow-view`,
      { viewerPatientId }
    );
    return response.data;
  } catch (error) {
    console.error("Error granting view access:", error);
    return null;
  }
};

// Revoke viewership permission
export const revokeViewAccess = async (
  documentId: string,
  viewerPatientId: string
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/patient/${documentId}/revoke-view`,
      { viewerPatientId }
    );
    return response.data;
  } catch (error) {
    console.error("Error revoking view access:", error);
    return null;
  }
};
