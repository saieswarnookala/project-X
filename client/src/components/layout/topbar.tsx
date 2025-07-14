import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface TopbarProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Topbar({ title, description, action }: TopbarProps) {
  const [, setLocation] = useLocation();

  const defaultAction = {
    label: "New Transaction",
    onClick: () => setLocation("/transactions/new"),
  };

  const currentAction = action || defaultAction;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Button 
            onClick={currentAction.onClick}
            className="bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2" size={16} />
            {currentAction.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
