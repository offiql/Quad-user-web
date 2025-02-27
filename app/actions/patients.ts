"use server"
import { backend_url } from "@/lib/utils";
import axios, { AxiosError } from "axios";

export const getPatients = async (access_token: string) => {
  try {
    const response = await axios.get(
      `${backend_url}/patient/get-patients`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return { patients: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("Error fetching patients:", axiosError);

    return {
      patients: [],
      error: axiosError.response?.data || "Failed to fetch patients",
    };
  }
};
