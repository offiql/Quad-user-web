"use server";

import axios, { AxiosError } from "axios";
import { Notification } from "@/components/types/patient";
import { revalidatePath } from "next/cache";
import { backend_url } from "@/lib/utils";

export const saveNotification = async (
  notification: Notification,
  access_token: string
) => {
  try {
    const response = await axios.post(
      `${backend_url}/notifications/create-notification-template`,
      notification,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
 
    return { data: response.data, error: null };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("Error saving notification:", axiosError);

    return {
      data: null,
      error:
        axiosError.response?.data?.message || "Failed to save notification",
    };
  }
};

export const getAllTemplates = async (access_token: string) => {
  try {
    const response = await axios.get(
      `${backend_url}/notifications/get-notification-templates/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("Templates", response.data)
    return { data: response.data, error: null };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("Error fetching notification templates:", axiosError);

    return {
      data: [],
      error:
        axiosError.response?.data?.message ||
        "Failed to fetch notification templates",
    };
  }
};
