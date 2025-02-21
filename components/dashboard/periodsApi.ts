// api/periodTracker.ts
import { backend_url } from "@/lib/utils";
import axios from "axios";

const BASE_URL = backend_url!; // Replace with your actual backend URL

interface PeriodData {
  startDate: string; // ISO format date string
  endDate: string;   // ISO format date string
}

export const fetchPeriods = async (patientId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/patient/periods`, {
      params: { patientId },
    });
    return response.data; // Expected: List of period objects
  } catch (error) {
    console.error("Error fetching periods:", error);
    throw error;
  }
};

export const addPeriod = async (patientId: string, periodData: PeriodData) => {
  try {
    const response = await axios.post(`${BASE_URL}/patient/periods`, {
      patientId,
      ...periodData,
    });
    return response.data; // Success or updated list
  } catch (error) {
    console.error("Error adding period:", error);
    throw error;
  }
};

export const updatePeriod = async (
  patientId: string,
  periodId: string,
  periodData: PeriodData
) => {
  try {
    const response = await axios.put(`${BASE_URL}/patient/periods/${periodId}`, {
      patientId,
      ...periodData,
    });
    return response.data; // Updated period data
  } catch (error) {
    console.error("Error updating period:", error);
    throw error;
  }
};

export const deletePeriod = async (periodId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/patient/periods/${periodId}`);
    return response.data; // Success or remaining list
  } catch (error) {
    console.error("Error deleting period:", error);
    throw error;
  }
};
