import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types";
import { Link } from "wouter";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Recent Transactions</h3>
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60" 
                    alt="Property" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-text">
                      Transaction #{transaction.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.purchasePrice ? `$${transaction.purchasePrice}` : "Price not set"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(transaction.status)}>
                    {formatStatus(transaction.status)}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    Close: {formatDate(transaction.expectedCloseDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
