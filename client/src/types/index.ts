export interface DashboardStats {
  activeTransactions: number;
  pendingDocuments: number;
  monthlyClosings: number;
  averageCloseTime: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'agent' | 'buyer' | 'seller' | 'lender' | 'title_company' | 'admin';
  phone?: string;
  company?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  purchasePrice?: string;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  propertyId?: number;
  agentId?: number;
  buyerId?: number;
  sellerId?: number;
  lenderId?: number;
  titleCompanyId?: number;
  status: 'pending' | 'active' | 'under_review' | 'completed' | 'cancelled';
  contractDate?: Date;
  closingDate?: Date;
  expectedCloseDate?: Date;
  purchasePrice?: string;
  loanAmount?: string;
  earnestMoney?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  transactionId?: number;
  assignedToId?: number;
  createdById?: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: number;
  transactionId?: number;
  uploadedById?: number;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  status: 'pending' | 'signed' | 'under_review' | 'approved' | 'rejected';
  isSigned: boolean;
  signedAt?: Date;
  signedById?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  transactionId?: number;
  senderId?: number;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface WebSocketMessage {
  type: 'transaction_created' | 'transaction_updated' | 'task_created' | 'task_updated' | 'document_created' | 'document_updated' | 'message_created' | 'message_read';
  [key: string]: any;
}
