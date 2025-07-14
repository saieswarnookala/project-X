import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, User, AlertCircle, CheckCircle } from "lucide-react";
import { Task } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export default function Tasks() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Filter tasks based on user role and permissions
  const filteredTasks = tasks.filter(t => 
    t.assignedToId === user?.id || 
    t.createdById === user?.id ||
    user?.role === 'admin'
  );

  // Apply search and filters
  const displayTasks = filteredTasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "in_progress":
        return "bg-primary bg-opacity-10 text-primary";
      case "pending":
        return "bg-warning bg-opacity-10 text-warning";
      case "overdue":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString();
  };

  const getDueDateStatus = (dueDate: Date | string | undefined) => {
    if (!dueDate) return "none";
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 2) return "soon";
    return "normal";
  };

  const getDueDateColor = (dueDate: Date | string | undefined) => {
    const status = getDueDateStatus(dueDate);
    switch (status) {
      case "overdue":
        return "text-red-600";
      case "today":
        return "text-warning";
      case "soon":
        return "text-primary";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Tasks" description="Manage your workflow tasks" />
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
          title="Tasks" 
          description="Manage your workflow tasks"
          action={{
            label: "New Task",
            onClick: () => console.log("New task clicked"),
          }}
        />
        
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search tasks..."
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
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayTasks.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? "No tasks match your filters" : "No tasks found"}
              </div>
            ) : (
              displayTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text mb-2">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {formatStatus(task.status)}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2" size={16} />
                        <span className={getDueDateColor(task.dueDate)}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2" size={16} />
                        <span>Transaction #{task.transactionId || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.status === 'completed' ? (
                        <Button variant="outline" size="sm" disabled className="flex-1">
                          <CheckCircle className="mr-2" size={16} />
                          Completed
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1">
                          Mark Complete
                        </Button>
                      )}
                      
                      {getDueDateStatus(task.dueDate) === 'overdue' && (
                        <AlertCircle className="text-red-500" size={20} />
                      )}
                    </div>
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
