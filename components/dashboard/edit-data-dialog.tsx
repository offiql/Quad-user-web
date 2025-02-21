"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";

interface DataPoint {
  date: string;
  value: number;
}

interface EditDataDialogProps {
  data: DataPoint[];
  onEditData: (oldDate: string, newDate: string, newValue: number) => void;
  onRemoveData: (date: string) => void;
  onDone: (updatedData: DataPoint[]) => void;
}

export function EditDataDialog({
  data,
  onEditData,
  onRemoveData,
  onDone,
}: EditDataDialogProps) {
  const [open, setOpen] = useState(false);
  const [editedData, setEditedData] = useState<DataPoint[]>(data);
  useEffect(() => {
    setEditedData(data);
  }, [data]);
  const handleEdit = (oldDate: string, newDate: string, newValue: string) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.date === oldDate
          ? { date: newDate, value: Number(newValue) }
          : item
      )
    );
  };

  const handleRemove = (dateToRemove: string) => {
    setEditedData((prevData) =>
      prevData.filter((item) => item.date !== dateToRemove)
    );
  };

  const handleDone = () => {
    onDone(editedData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-[#3B0764] hover:bg-purple-900">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Points</DialogTitle>
          <DialogDescription>
            Make changes to the data points or remove them.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto hide-scrollbar p-2">
          {editedData.map((item) => (
            <div key={item.date} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`date-${item.date}`} className="text-left">
                  Date
                </Label>
                <Input
                  id={`date-${item.date}`}
                  type="date"
                  value={item.date}
                  onChange={(e) =>
                    handleEdit(item.date, e.target.value, item.value.toString())
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`value-${item.date}`} className="text-left">
                  Value
                </Label>
                <Input
                  id={`value-${item.date}`}
                  type="number"
                  value={item.value}
                  onChange={(e) =>
                    handleEdit(item.date, item.date, e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemove(item.date)}
                className="ml-auto"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleDone}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
