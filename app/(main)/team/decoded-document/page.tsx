"use client";

import { getUserData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const user = getUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleAssignDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const response = await fetch(
        `${backend_url}/admin/${user.userId}/assign-pending-documents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newDocId = await response.json();

      if (!response.ok) {
        setError(true);
        setIsLoading(false);
        return;
      }

      if (newDocId) {
        router.push(`/team/decoded-document/${newDocId}`);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error assigning documents:", error);
      setError(true);
      setIsLoading(false);
    }
  }, [router, user.userId]);

  useEffect(() => {
    handleAssignDocument();
  }, [handleAssignDocument]);

  if (isLoading) {
    return (
      <div className="flex h-dvh justify-center items-center">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Looking for available documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-dvh py-8">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="mt-4">No Documents Available</CardTitle>
          <CardDescription>
            There are currently no documents waiting to be assigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => handleAssignDocument()} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
