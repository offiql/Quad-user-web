"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import AddDataDialog from "./add-data-dialog";
import { EditDataDialog } from "./edit-data-dialog";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface DataPoint {
  date: string;
  value: number;
}

interface MonitoringChartProps {
  title: string;
  data: DataPoint[];
  yAxisLabel: string;
  maxValue: number;
  type: string;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  updateBackend: any;
}

export default function MonitoringChart({
  title,
  data,
  yAxisLabel,
  type,
  maxValue,
  isCollapsible = false,
  isExpanded = true,
  onToggle,
  updateBackend,
}: MonitoringChartProps) {
  const [chartData, setChartData] = useState(data);
  useEffect(() => {
    setChartData(data);
  }, [data]);
  const formattedData = chartData
    .map((item) => ({
      ...item,
      formattedDate: format(parseISO(item.date), "d MMM"),
    }))
    .slice(-7);

  const handleAddData = (date: string, value: number) => {
    const newData = [...chartData, { date, value }];
    updateBackend(newData, type);
  };

  const handleEditData = (updatedData: DataPoint[]) => {
    updateBackend(updatedData, type);
  };

  return (
    <Card className="w-full bg-[#F8EFFF] border-none max-w-[500px] xl:max-w-full">
      {isCollapsible ? (
        <div className="flex items-center w-full justify-between p-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm md:text-xl font-medium text-gray-700">
              {title}
            </CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={onToggle}
            />
          </div>
          <div className="flex gap-2">
            <AddDataDialog onAddData={handleAddData} />
            <EditDataDialog
              data={chartData}
              onEditData={(oldDate, newDate, newValue) => {
                const updatedData = chartData.map((item) =>
                  item.date === oldDate
                    ? { date: newDate, value: newValue }
                    : item
                );
                handleEditData(updatedData);
              }}
              onRemoveData={(dateToRemove) => {
                const updatedData = chartData.filter(
                  (item) => item.date !== dateToRemove
                );
                handleEditData(updatedData);
              }}
              onDone={handleEditData}
            />
          </div>
        </div>
      ) : (
        <CardHeader className="flex bg-[#11244933] flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm md:text-xl font-medium text-gray-700">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <AddDataDialog onAddData={handleAddData} />
            <EditDataDialog
              data={chartData}
              onEditData={(oldDate, newDate, newValue) => {
                const updatedData = chartData.map((item) =>
                  item.date === oldDate
                    ? { date: newDate, value: newValue }
                    : item
                );
                handleEditData(updatedData);
              }}
              onRemoveData={(dateToRemove) => {
                const updatedData = chartData.filter(
                  (item) => item.date !== dateToRemove
                );
                handleEditData(updatedData);
              }}
              onDone={handleEditData}
            />
          </div>
        </CardHeader>
      )}
      {(!isCollapsible || isExpanded) && (
        <CardContent className="w-[calc(100dvw-3rem)] pl-0 sm:w-full overflow-y-auto">
          <ChartContainer
            config={{
              value: {
                label: yAxisLabel,
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[220px] w-full  "
          >
            <BarChart data={formattedData} barSize={6} barGap={1}>
              <XAxis
                dataKey="formattedDate"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, maxValue]}
              />
              <Bar
                dataKey="value"
                fill="#3B0764"
                radius={[3, 3, 3, 3]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
