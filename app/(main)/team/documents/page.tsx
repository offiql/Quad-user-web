"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Link2, UserPlus } from "lucide-react";
import PDFViewer from "@/components/admin/document/pdf-viewer";
import { Badge } from "@/components/ui/badge";
import { backend_url } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getUserData } from "@/lib/getTokens";
import { toast } from "sonner";

const DocumentTable = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const user = getUserData();
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const getDocs = async () => {
    const response = await fetch(
      `${backend_url}/admin/${user.userId}/assigned-pending-documents?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    if (data.message) {
      toast.error(data.message);
    }
    setDocuments(data.data);
    setTotalPages(data.pagination.totalPages);
  };
  useEffect(() => {
    if (user.userId) {
      getDocs();
    }
  }, [page, limit]);

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
  };

  const handleCloseDialog = () => {
    setSelectedDocument(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "processing":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  const formatDate = (timestamp: string | null | undefined): string => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toISOString().split("T")[0];
  };

  const handleAssignDocument = async () => {
    try {
      const response = await fetch(
        `${backend_url}/admin/${user.userId}/assign-pending-documents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedDocs = await response.json();

      if (!response.ok) {
        // Handle API error response properly
        toast.error(updatedDocs.message || "Failed to assign documents.");
        return;
      }

      getDocs();
    } catch (error) {
      console.error("Error assigning documents:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full p-4 pt-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Submitted Documents</h2>
        <Button onClick={handleAssignDocument} className="flex gap-2">
          <UserPlus className="h-5 w-5" /> Assign Pending Document
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Document Name</TableCell>
            <TableCell>Patient Name</TableCell>
            <TableCell>Received Date</TableCell>
            <TableCell>Upload Time</TableCell>
            <TableCell>Labelled Date</TableCell>
            <TableCell>Process Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc: any, index) => (
            <TableRow key={index}>
              <TableCell className="capitalize">{doc.type}</TableCell>
              <TableCell>{doc.patientName}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{formatDate(doc.createdAt)}</TableCell>
              <TableCell>{formatDate(doc.updatedAt)}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(doc.status)} font-normal`}
                >
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleViewDocument(doc)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Link href={`/team/decoded-document/${doc._id}`}>
                  <Link2 className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={selectedDocument !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-dvh max-w-3xl overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument?.fileUrl?.toLowerCase().endsWith(".pdf") ? (
            <PDFViewer src={selectedDocument?.fileUrl} />
          ) : (
            <img
              src={selectedDocument?.fileUrl || "/placeholder.svg"}
              alt="Prescription Preview"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTable;
