import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { Link } from "wouter";

interface PendingTasksProps {
  tasks: Task[];
}

export default function PendingTasks({ tasks }: PendingTasksProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-warning bg-warning bg-opacity-5";
      case "medium":
        return "border-primary bg-primary bg-opacity-5";
      case "low":
        return "border-secondary bg-secondary bg-opacity-5";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const formatDueDate = (dueDate: Date | string | undefined) => {
    if (!dueDate) return "No due date";
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays < 0) return "Overdue";
    return `Due ${date.toLocaleDateString()}`;
  };

  const getDueDateColor = (dueDate: Date | string | undefined) => {
    if (!dueDate) return "text-gray-500";
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600 font-medium";
    if (diffDays === 0) return "text-warning font-medium";
    if (diffDays <= 2) return "text-primary font-medium";
    return "text-secondary font-medium";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Pending Tasks</h3>
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending tasks
            </div>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <div key={task.id} className={`flex items-center justify-between p-4 border-l-4 rounded-r-lg ${getPriorityColor(task.priority)}`}>
                <div>
                  <p className="font-medium text-text">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    Transaction #{task.transactionId || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${getDueDateColor(task.dueDate)}`}>
                    {formatDueDate(task.dueDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Priority: {task.priority}
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
