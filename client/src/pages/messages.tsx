import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Search, Filter, MessageCircle, User, Clock } from "lucide-react";
import { Message, Transaction, User as UserType } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";

export default function Messages() {
  const { user } = useAuth();
  const { lastMessage } = useWebSocket(user?.id);
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        senderId: user?.id,
        transactionId: selectedTransaction !== "all" ? parseInt(selectedTransaction) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMessage("");
    },
  });

  // Filter messages based on user role and permissions
  const filteredMessages = messages.filter(m => 
    m.senderId === user?.id ||
    user?.role === 'admin' ||
    // Show messages from transactions the user is involved in
    transactions.some(t => 
      t.id === m.transactionId && 
      (t.agentId === user?.id || t.buyerId === user?.id || t.sellerId === user?.id || 
       t.lenderId === user?.id || t.titleCompanyId === user?.id)
    )
  );

  // Apply search and transaction filters
  const displayMessages = filteredMessages.filter(message => {
    const matchesSearch = searchTerm === "" || 
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTransaction = selectedTransaction === "all" || 
      message.transactionId?.toString() === selectedTransaction;
    
    return matchesSearch && matchesTransaction;
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Unknown";
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
  };

  const getUserById = (userId: number | undefined) => {
    if (!userId) return null;
    return users.find(u => u.id === userId);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (userId: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-warning', 'bg-accent'];
    return colors[userId % colors.length];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "delivered":
        return "bg-primary bg-opacity-10 text-primary";
      case "sent":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Messages" description="Communicate with transaction participants" />
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
          title="Messages" 
          description="Communicate with transaction participants"
          action={{
            label: "New Message",
            onClick: () => console.log("New message clicked"),
          }}
        />
        
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
              <SelectTrigger className="w-64">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                {transactions.map((transaction) => (
                  <SelectItem key={transaction.id} value={transaction.id.toString()}>
                    Transaction #{transaction.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-text">Conversation</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {displayMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>No messages found</p>
                        <p className="text-sm">Start a conversation by sending a message below</p>
                      </div>
                    ) : (
                      displayMessages.map((message) => {
                        const sender = getUserById(message.senderId);
                        const isCurrentUser = message.senderId === user?.id;
                        
                        return (
                          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                              <div className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`w-8 h-8 ${getAvatarColor(message.senderId || 0)} rounded-full flex items-center justify-center`}>
                                  <span className="text-white text-sm font-medium">
                                    {sender ? getInitials(sender.firstName, sender.lastName) : 'U'}
                                  </span>
                                </div>
                                <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-medium text-text text-sm">
                                      {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatTimeAgo(message.createdAt)}
                                    </p>
                                  </div>
                                  <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <Badge className={`${getStatusColor(message.status)} text-xs`}>
                                      {message.status}
                                    </Badge>
                                    {message.transactionId && (
                                      <span className="text-xs text-gray-500">
                                        Transaction #{message.transactionId}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px] resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-primary text-white hover:bg-blue-700"
                      >
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversation Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-text">Active Conversations</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => {
                      const transactionMessages = messages.filter(m => m.transactionId === transaction.id);
                      const lastMessage = transactionMessages[transactionMessages.length - 1];
                      
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-text text-sm">
                              Transaction #{transaction.id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transactionMessages.length} messages
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {lastMessage ? formatTimeAgo(lastMessage.createdAt) : 'No messages'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-text">Message Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="text-primary" size={16} />
                        <span className="text-sm text-gray-600">Total Messages</span>
                      </div>
                      <span className="font-medium text-text">{displayMessages.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-warning" size={16} />
                        <span className="text-sm text-gray-600">Unread</span>
                      </div>
                      <span className="font-medium text-text">
                        {displayMessages.filter(m => !m.isRead).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="text-secondary" size={16} />
                        <span className="text-sm text-gray-600">Conversations</span>
                      </div>
                      <span className="font-medium text-text">
                        {new Set(displayMessages.map(m => m.transactionId)).size}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
