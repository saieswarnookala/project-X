import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical } from "lucide-react";
import { Message } from "@/types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface CommunicationHubProps {
  messages: Message[];
}

export default function CommunicationHub({ messages }: CommunicationHubProps) {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        senderId: user?.id,
        transactionId: 1, // Default transaction for demo
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMessage("");
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Unknown";
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return messageDate.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-warning', 'bg-accent'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Messages</h3>
          <Button variant="ghost" size="sm">
            <MoreVertical size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet
            </div>
          ) : (
            messages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${getAvatarColor('User')} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">
                    {getInitials('User')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-text text-sm">User</p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(message.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                </div>
              </div>
            ))
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
