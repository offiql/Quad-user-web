"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  addMonths,
  format,
  subMonths,
  differenceInDays,
  addDays,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Patient } from "../types/patient";
import { getpatientData } from "@/lib/getTokens";
import { addPeriod, fetchPeriods } from "../dashboard/periodsApi";

interface PeriodData {
  startDate: Date;
  endDate: Date;
}


export default function PeriodTracker({
    relationProfileDetails,
  }: {
    relationProfileDetails: Patient;
  }) {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  const [periods, setPeriods] = React.useState<PeriodData[]>([]);
  const [newPeriodStart, setNewPeriodStart] = React.useState("");
  const [newPeriodEnd, setNewPeriodEnd] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (relationProfileDetails && relationProfileDetails?.gender === "Female") {
      const loadPeriods = async () => {
        try {
          const periods = await fetchPeriods(relationProfileDetails?._id);
          setPeriods(
            periods.map((p: PeriodData) => ({
              startDate: new Date(p.startDate),
              endDate: new Date(p.endDate),
            }))
          );
        } catch (err) {
          console.error(err);
        }
      };
      loadPeriods();
    }
  }, [relationProfileDetails]);

  const sortedPeriods = React.useMemo(
    () =>
      [...periods].sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime()
      ),
    [periods]
  );

  const averageCycleLength = React.useMemo(() => {
    if (sortedPeriods.length < 2) return null;
    const cycleLengths = sortedPeriods
      .slice(0, -1)
      .map((period, index) =>
        differenceInDays(
          sortedPeriods[index].startDate,
          sortedPeriods[index + 1].startDate
        )
      );
    return Math.round(
      cycleLengths.reduce((sum, length) => sum + length, 0) /
        cycleLengths.length
    );
  }, [sortedPeriods]);

  const nextPrediction = React.useMemo(() => {
    if (sortedPeriods.length < 2 || !averageCycleLength) return null;
    return addDays(sortedPeriods[0].startDate, averageCycleLength);
  }, [sortedPeriods, averageCycleLength]);

  const nextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));
  const previousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPeriodStart && newPeriodEnd && relationProfileDetails && relationProfileDetails?.gender === "Female") {
      const newPeriod = {
        startDate: new Date(newPeriodStart),
        endDate: new Date(newPeriodEnd),
      };
      const newPeriodS = {
        startDate: new Date(newPeriodStart).toISOString(),
        endDate: new Date(newPeriodEnd).toISOString(),
      };
      try {
        await addPeriod(relationProfileDetails?._id, newPeriodS);
        setPeriods([newPeriod, ...periods]);
        setNewPeriodStart("");
        setNewPeriodEnd("");
        setIsDialogOpen(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isWithinPeriod = (date: Date) => {
    return periods.some(
      (period) => date >= period.startDate && date <= period.endDate
    );
  };

  return (
    <>
      {relationProfileDetails?.gender === "Female" && (
        <div className="lg:grid-cols-2 w-full">
          <div className="grid gap-4 w-full lg:grid-cols-2">
            <Card className="w-[calc(100dvw-3rem)] md:w-full overflow-y-auto">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">Period Prediction</CardTitle>
                {nextPrediction && (
                  <p className="text-sm font-medium text-[#59748A]">
                    Your next period is likely to start around{" "}
                    {format(nextPrediction, "do MMMM yyyy")}
                  </p>
                )}
                {averageCycleLength && (
                  <p className="text-sm font-medium text-[#59748A]">
                    Average cycle length: {averageCycleLength} days
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="w-10 h-10 p-0"
                      onClick={previousMonth}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="font-semibold">
                      {format(selectedMonth, "MMMM yyyy")}
                    </div>
                    <Button
                      variant="outline"
                      className="w-10 h-10 p-0"
                      onClick={nextMonth}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    month={selectedMonth}
                    className="rounded-md border w-fit mx-auto"
                    modifiers={{
                      period: (date) => isWithinPeriod(date),
                      //@ts-ignore
                      predicted: (date) =>
                        nextPrediction &&
                        date.getTime() === nextPrediction.getTime(),
                    }}
                    modifiersStyles={{
                      period: {
                        backgroundColor: "#3B016B",
                        color: "white",
                      },
                      predicted: {
                        backgroundColor: "#F8EFFF",
                        color: "#3B016B",
                        border: "2px solid #3B016B",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="w-[calc(100dvw-3rem)] md:w-full overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">
                  Menstruation Cycle History
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Period</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPeriod} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="period-start">Start Date</Label>
                          <Input
                            id="period-start"
                            type="date"
                            value={newPeriodStart}
                            onChange={(e) => setNewPeriodStart(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="period-end">End Date</Label>
                          <Input
                            id="period-end"
                            type="date"
                            value={newPeriodEnd}
                            onChange={(e) => setNewPeriodEnd(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Add Period
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedPeriods.slice(0, 5).map((period, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-sm font-medium text-[#59748A]">
                        Cycle: {format(period.startDate, "dd MMM")} -{" "}
                        {format(period.endDate, "dd MMM yyyy")}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(28)].map((_, dayIndex) => {
                          const currentDate = new Date(period.startDate);
                          currentDate.setDate(currentDate.getDate() + dayIndex);
                          const isPeriodDay = isWithinPeriod(currentDate);
                          return (
                            <div
                              key={dayIndex}
                              className={`h-7 w-4 rounded-full ${
                                isPeriodDay ? "bg-[#3B016B]" : "bg-[#F8EFFF]"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
