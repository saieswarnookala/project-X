import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building, Search, Filter, UserPlus } from "lucide-react";
import { User as UserType } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export default function Contacts() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: users = [], isLoading } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
  });

  // Apply search and role filters
  const displayUsers = users.filter(contact => {
    const matchesSearch = searchTerm === "" || 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || contact.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-600";
      case "agent":
        return "bg-primary bg-opacity-10 text-primary";
      case "buyer":
        return "bg-green-100 text-green-600";
      case "seller":
        return "bg-orange-100 text-orange-600";
      case "lender":
        return "bg-blue-100 text-blue-600";
      case "title_company":
        return "bg-accent bg-opacity-10 text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case "title_company":
        return "Title Company";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (userId: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-warning', 'bg-accent', 'bg-purple-500', 'bg-pink-500'];
    return colors[userId % colors.length];
  };

  const roleStats = {
    total: users.length,
    agents: users.filter(u => u.role === 'agent').length,
    buyers: users.filter(u => u.role === 'buyer').length,
    sellers: users.filter(u => u.role === 'seller').length,
    lenders: users.filter(u => u.role === 'lender').length,
    titleCompanies: users.filter(u => u.role === 'title_company').length,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Contacts" description="Manage your professional network" />
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
          title="Contacts" 
          description="Manage your professional network"
          action={{
            label: "Add Contact",
            onClick: () => console.log("Add contact clicked"),
          }}
        />
        
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-text">{roleStats.total}</div>
                <div className="text-sm text-gray-500">Total Contacts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{roleStats.agents}</div>
                <div className="text-sm text-gray-500">Agents</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{roleStats.buyers}</div>
                <div className="text-sm text-gray-500">Buyers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{roleStats.sellers}</div>
                <div className="text-sm text-gray-500">Sellers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{roleStats.lenders}</div>
                <div className="text-sm text-gray-500">Lenders</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">{roleStats.titleCompanies}</div>
                <div className="text-sm text-gray-500">Title Companies</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="lender">Lender</SelectItem>
                <SelectItem value="title_company">Title Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUsers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No contacts found</p>
                <p className="text-sm">
                  {searchTerm || roleFilter !== "all" ? "Try adjusting your search or filters" : "Add some contacts to get started"}
                </p>
              </div>
            ) : (
              displayUsers.map((contact) => (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 ${getAvatarColor(contact.id)} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium">
                          {getInitials(contact.firstName, contact.lastName)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <Badge className={getRoleColor(contact.role)}>
                          {formatRole(contact.role)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-2 flex-shrink-0" size={16} />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="mr-2 flex-shrink-0" size={16} />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="mr-2 flex-shrink-0" size={16} />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${contact.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-gray-500">
                          {contact.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <User className="mr-2" size={16} />
                        View Profile
                      </Button>
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
