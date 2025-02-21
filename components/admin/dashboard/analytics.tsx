"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Clock, RefreshCw } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const data = [
  { date: "May 5", pending: 220, decoded: 140 },
  { date: "May 6", pending: 180, decoded: 120 },
  { date: "May 7", pending: 190, decoded: 100 },
  { date: "May 8", pending: 280, decoded: 160 },
  { date: "May 9", pending: 340, decoded: 200 },
  { date: "May 10", pending: 380, decoded: 240 },
  { date: "May 11", pending: 280, decoded: 180 },
  { date: "May 12", pending: 220, decoded: 120 },
  { date: "May 13", pending: 180, decoded: 80 },
  { date: "May 14", pending: 160, decoded: 100 },
];

const pieData = [
  { name: "Documents uploaded", value: 75 },
  { name: "Pending", value: 25 },
];

const COLORS = ["#E9D5FF", "#7E22CE"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="p-6 space-y-8 col-span-full md:col-span-3 overflow-y-auto h-full overflow-hidden hide-scrollbar">
      <div className="text-2xl font-semibold">Admin Panel</div>

      <div className="grid col-span-full md:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-3 flex justify-center items-center flex-col">
            <div className="flex items-center justify-center">
              <Download className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">5000</div>
            <div className="text-sm text-center text-muted-foreground">
              Total Documents Uploaded by Patients
            </div>
          </Card>

          <Card className="p-3 space-y-2 flex justify-center items-center flex-col">
            <div className="flex items-center justify-between">
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">5000</div>
            <div className="text-sm text-center text-muted-foreground">
              Total Documents Reviewed by Team
            </div>
          </Card>

          <Card className="p-3 space-y-2 flex justify-center items-center flex-col">
            <div className="flex items-center justify-between">
              <Clock className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">5000</div>
            <div className="text-sm text-center text-muted-foreground">
              Total Documents Pending
            </div>
          </Card>

          <Card className="p-3 space-y-2 flex justify-center items-center flex-col">
            <div className="flex items-center justify-between">
              <RefreshCw className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">5000</div>
            <div className="text-sm text-center text-muted-foreground">
              Total Documents Resubmitted
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <ChartContainer
            config={{
              uploaded: {
                label: "Documents uploaded",
                color: "#E9D5FF",
              },
              pending: {
                label: "Pending",
                color: "#7E22CE",
              },
            }}
            className="aspect-square"
          >
            <div className="relative w-full h-full flex justify-center items-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Performance</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-100" />
                      <div className="text-sm">Documents uploaded</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <div className="text-sm">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
              <PieChart width={400} height={400}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={150}
                  outerRadius={180}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
          </ChartContainer>
        </Card>
      </div>

      <div className="grid gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Total Documents Uploaded</h3>
            <Tabs defaultValue="day">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#4ADE80"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, fill: "#4ADE80" }}
                />
                <Line
                  type="monotone"
                  dataKey="decoded"
                  stroke="#FB923C"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, fill: "#FB923C" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-sm">Decoded</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
