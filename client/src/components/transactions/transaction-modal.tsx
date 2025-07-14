import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction, Property } from "@/types";

interface TransactionModalProps {
  transaction: Transaction | null;
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ transaction, property, isOpen, onClose }: TransactionModalProps) {
  if (!transaction) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary";
      case "pending":
        return "bg-warning text-warning";
      case "completed":
        return "bg-secondary text-secondary";
      case "under_review":
        return "bg-accent text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const timeline = [
    { event: "Contract Signed", date: transaction.contractDate, completed: !!transaction.contractDate },
    { event: "Inspection Scheduled", date: null, completed: false },
    { event: "Appraisal Ordered", date: null, completed: false },
    { event: "Final Walkthrough", date: null, completed: false },
    { event: "Closing", date: transaction.expectedCloseDate, completed: transaction.status === 'completed' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Transaction Details</DialogTitle>
            <Badge className={`${getStatusColor(transaction.status)} bg-opacity-10`}>
              {formatStatus(transaction.status)}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-semibold text-text mb-4">Property Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                <p className="text-sm text-gray-900">#{transaction.id}</p>
              </div>
              {property && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Address</label>
                    <p className="text-sm text-gray-900">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Type</label>
                    <p className="text-sm text-gray-900">{property.propertyType}</p>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                <p className="text-sm text-gray-900">
                  {transaction.purchasePrice ? `$${transaction.purchasePrice}` : "Not set"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                <p className="text-sm text-gray-900">
                  {transaction.loanAmount ? `$${transaction.loanAmount}` : "Not set"}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Transaction Timeline</h4>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-secondary' : 'bg-gray-300'}`} />
                  <div>
                    <p className={`text-sm font-medium ${item.completed ? 'text-text' : 'text-gray-400'}`}>
                      {item.event}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.date ? formatDate(item.date) : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {transaction.notes && (
          <div className="mt-6">
            <h4 className="font-semibold text-text mb-2">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{transaction.notes}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
