import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import TransactionModal from "@/components/transactions/transaction-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter } from "lucide-react";
import { Transaction, Property } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export default function Transactions() {
  const { user } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Filter transactions based on user role and permissions
  const filteredTransactions = transactions.filter(t => 
    t.agentId === user?.id || 
    t.buyerId === user?.id || 
    t.sellerId === user?.id || 
    t.lenderId === user?.id || 
    t.titleCompanyId === user?.id ||
    user?.role === 'admin'
  );

  // Apply search and status filters
  const displayTransactions = filteredTransactions.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.id.toString().includes(searchTerm) ||
      transaction.purchasePrice?.includes(searchTerm) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary bg-opacity-10 text-primary";
      case "pending":
        return "bg-warning bg-opacity-10 text-warning";
      case "completed":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "under_review":
        return "bg-accent bg-opacity-10 text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review";
      case "active":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    const property = properties.find(p => p.id === transaction.propertyId);
    setSelectedProperty(property || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setSelectedProperty(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Transactions" description="Manage your real estate transactions" />
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
          title="Transactions" 
          description="Manage your real estate transactions"
          action={{
            label: "New Transaction",
            onClick: () => console.log("New transaction clicked"),
          }}
        />
        
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search transactions..."
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
                <SelectItem value="active">In Progress</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayTransactions.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm || statusFilter !== "all" ? "No transactions match your filters" : "No transactions found"}
              </div>
            ) : (
              displayTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-text">
                          Transaction #{transaction.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {transaction.purchasePrice ? `$${transaction.purchasePrice}` : "Price not set"}
                        </p>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {formatStatus(transaction.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Contract Date:</span>
                        <span className="text-text">{formatDate(transaction.contractDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Close:</span>
                        <span className="text-text">{formatDate(transaction.expectedCloseDate)}</span>
                      </div>
                      {transaction.loanAmount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Loan Amount:</span>
                          <span className="text-text">${transaction.loanAmount}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTransaction(transaction)}
                      className="w-full"
                    >
                      <Eye className="mr-2" size={16} />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
