"use client";

import { getAccessToken, getpatientData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MonitoringChart from "./relationMonitorChart";
import { useRouter } from "next/navigation";
import { Patient, Relation } from "../types/patient";

interface DataPoint {
  date: string;
  value: number;
  _id: string;
}

export default function HealthRelationMonitoring({
  relationProfileDetails,
}: {
  relationProfileDetails: Patient;
}) {
  const [isExpanded1, setIsExpanded1] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);
  const [diabetes, setDiabetes] = useState<DataPoint[]>([]);
  const [bloodpressure, setBloodpressure] = useState<DataPoint[]>([]);

  const fetchData = async (type: string): Promise<DataPoint[]> => {
    const access_token = getAccessToken();
    try {
      const response = await fetch(`${backend_url}/patient/fetch-chart?patientId=${relationProfileDetails._id}&type=${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        }
      });
      if (!response.ok) {
        // toast.error("Failed to update chart data");
        return [];
      }

      const result = await response.json();
      console.log(`Fetched ${type} data:`, result);
      return result;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      // toast.error(`Failed to fetch ${type} data`);
      return [];
    }
  };
  // Fetch initial data
  const fetchInitialData = async () => {
    const diabetesData = await fetchData("diabetes");
    const bloodPressureData = await fetchData("bloodpressure");

    setDiabetes(diabetesData);
    setBloodpressure(bloodPressureData);
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="grid xl:grid-cols-2 w-full gap-4 py-4 pt-8">
      {relationProfileDetails?.isDiabetic === "Yes" && (
        <MonitoringChart
          title="Diabetes Monitoring"
          data={diabetes}
          type={"diabetes"}
          yAxisLabel="mg/dl"
          maxValue={100}
          isCollapsible
          isExpanded={isExpanded1}
          onToggle={() => setIsExpanded1(!isExpanded1)}
        />
      )}
      {relationProfileDetails?.hasBloodPressure === "Yes" && (
        <MonitoringChart
          title="Blood Pressure Monitoring"
          data={bloodpressure}
          type={"bloodpressure"}
          yAxisLabel="mm/Hg"
          maxValue={100}
          isCollapsible
          isExpanded={isExpanded2}
          onToggle={() => setIsExpanded2(!isExpanded2)}
        />
      )}
    </div>
  );
}
