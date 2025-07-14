import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import PendingTasks from "@/components/dashboard/pending-tasks";
import DocumentManagement from "@/components/dashboard/document-management";
import CommunicationHub from "@/components/dashboard/communication-hub";
import { DashboardStats, Transaction, Task, Document, Message } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Dashboard() {
  const { user } = useAuth();
  const { lastMessage } = useWebSocket(user?.id);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  // Filter data based on user role and permissions
  const filteredTransactions = transactions.filter(t => 
    t.agentId === user?.id || 
    t.buyerId === user?.id || 
    t.sellerId === user?.id || 
    t.lenderId === user?.id || 
    t.titleCompanyId === user?.id ||
    user?.role === 'admin'
  );

  const filteredTasks = tasks.filter(t => 
    t.assignedToId === user?.id || 
    t.createdById === user?.id ||
    user?.role === 'admin'
  );

  const filteredDocuments = documents.filter(d => 
    d.uploadedById === user?.id ||
    user?.role === 'admin'
  );

  const filteredMessages = messages.filter(m => 
    m.senderId === user?.id ||
    user?.role === 'admin'
  );

  const isLoading = statsLoading || transactionsLoading || tasksLoading || documentsLoading || messagesLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Dashboard" description="Manage your real estate transactions" />
          <div className="p-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
                ))}
              </div>
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
        <Topbar title="Dashboard" description="Manage your real estate transactions" />
        
        <div className="p-6 space-y-8">
          {stats && <StatsCards stats={stats} />}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions transactions={filteredTransactions} />
            <PendingTasks tasks={filteredTasks} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DocumentManagement documents={filteredDocuments} />
            <CommunicationHub messages={filteredMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}
