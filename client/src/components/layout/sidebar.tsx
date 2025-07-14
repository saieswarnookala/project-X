import { Link, useLocation } from "wouter";
import { Home, Handshake, FileText, CheckSquare, MessageCircle, Users, Plus, Upload, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: Handshake },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Contacts", href: "/contacts", icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className={`w-64 bg-white shadow-lg flex flex-col ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text">Project-X</h1>
            <p className="text-sm text-gray-500">Real Estate Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 flex-1">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-gray-600 hover:text-text hover:bg-gray-50"
                  }`}
                >
                  <Icon className="mr-3" size={18} />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link href="/transactions/new">
              <a className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors">
                <Plus className="mr-3" size={18} />
                New Transaction
              </a>
            </Link>
            <Link href="/documents/upload">
              <a className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors">
                <Upload className="mr-3" size={18} />
                Upload Document
              </a>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
