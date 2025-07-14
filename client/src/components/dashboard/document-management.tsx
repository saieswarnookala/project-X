import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload } from "lucide-react";
import { Document } from "@/types";
import { Link } from "wouter";

interface DocumentManagementProps {
  documents: Document[];
}

export default function DocumentManagement({ documents }: DocumentManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "pending":
        return "bg-warning bg-opacity-10 text-warning";
      case "under_review":
        return "bg-primary bg-opacity-10 text-primary";
      case "approved":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review";
      case "pending":
        return "Pending Review";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Document Management</h3>
          <Link href="/documents/upload">
            <Button className="bg-primary text-white hover:bg-blue-700">
              <Upload className="mr-2" size={16} />
              Upload Document
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents found
            </div>
          ) : (
            documents.slice(0, 3).map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60" 
                    alt="Document" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-text">{document.name}</p>
                    <p className="text-sm text-gray-500">
                      {document.type.toUpperCase()} • {formatFileSize(document.size)} • Updated {formatDate(document.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(document.status)}>
                    {formatStatus(document.status)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
