import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, FileText, Upload } from "lucide-react";
import { Document } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export default function Documents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  // Filter documents based on user role and permissions
  const filteredDocuments = documents.filter(d => 
    d.uploadedById === user?.id ||
    user?.role === 'admin'
  );

  // Apply search and status filters
  const displayDocuments = filteredDocuments.filter(document => {
    const matchesSearch = searchTerm === "" || 
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || document.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Documents" description="Manage your transaction documents" />
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Topbar 
          title="Documents" 
          description="Manage your transaction documents"
          action={{
            label: "Upload Document",
            onClick: () => console.log("Upload document clicked"),
          }}
        />
        
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayDocuments.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm || statusFilter !== "all" ? "No documents match your filters" : "No documents found"}
              </div>
            ) : (
              displayDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-gray-600" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text truncate">
                          {document.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {document.type.toUpperCase()} • {formatFileSize(document.size)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Updated {formatDate(document.updatedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge className={getStatusColor(document.status)}>
                        {formatStatus(document.status)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download size={16} />
                      </Button>
                    </div>
                    
                    {document.isSigned && (
                      <div className="mt-2 p-2 bg-secondary bg-opacity-10 rounded-lg">
                        <p className="text-sm text-secondary">
                          Signed on {formatDate(document.signedAt)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
