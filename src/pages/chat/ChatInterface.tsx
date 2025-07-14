import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  MessageCircle,
  Users,
} from "lucide-react";
import { ChatMessage, ChatConversation, User } from "@/types";
import { apiService, mockUsers } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const ChatInterface = () => {
  const { state } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!state.user) return;

      try {
        // Mock conversations - in real app, this would come from API
        const userRole = state.user.role;
        const otherUsers = mockUsers.filter((user) => user.role !== userRole);

        const mockConversations: ChatConversation[] = otherUsers.map(
          (user) => ({
            id: `conv_${state.user!.id}_${user.id}`,
            participantIds: [state.user!.id, user.id],
            lastMessage: {
              id: "last_msg",
              senderId: user.id,
              receiverId: state.user!.id,
              message: "Hello! How can I help you today?",
              timestamp: new Date().toISOString(),
              isRead: false,
              type: "text",
            },
            updatedAt: new Date().toISOString(),
            isActive: true,
          }),
        );

        setConversations(mockConversations);

        // Auto-select first conversation
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0].id);
          await fetchMessages(mockConversations[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [state.user]);

  const fetchMessages = async (conversationId: string) => {
    if (!state.user) return;

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const otherUserId = conversation.participantIds.find(
      (id) => id !== state.user!.id,
    );
    if (!otherUserId) return;

    try {
      const messagesData = await apiService.getChatMessages(
        state.user.id,
        otherUserId,
      );
      setMessages(messagesData);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !state.user) return;

    const conversation = conversations.find(
      (c) => c.id === selectedConversation,
    );
    if (!conversation) return;

    const otherUserId = conversation.participantIds.find(
      (id) => id !== state.user!.id,
    );
    if (!otherUserId) return;

    try {
      const message = await apiService.sendMessage(
        state.user.id,
        otherUserId,
        newMessage,
      );
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = (conversation: ChatConversation): User | null => {
    const otherUserId = conversation.participantIds.find(
      (id) => id !== state.user?.id,
    );
    return mockUsers.find((user) => user.id === otherUserId) || null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === "doctor"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = getOtherUser(conversation);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedConversationData = conversations.find(
    (c) => c.id === selectedConversation,
  );
  const selectedOtherUser = selectedConversationData
    ? getOtherUser(selectedConversationData)
    : null;

  if (isLoading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversations List */}
        <div className="w-1/3 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                if (!otherUser) return null;

                return (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(otherUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherUser.name}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {new Date(
                                conversation.lastMessage.timestamp,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.message ||
                              "No messages yet"}
                          </p>
                          {conversation.lastMessage &&
                            !conversation.lastMessage.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <Badge
                          className={`mt-1 text-xs ${getRoleColor(otherUser.role)}`}
                        >
                          {otherUser.role.charAt(0).toUpperCase() +
                            otherUser.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="h-12 w-12 mb-3 text-gray-300" />
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedOtherUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getInitials(selectedOtherUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedOtherUser.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(selectedOtherUser.role)}>
                        {selectedOtherUser.role.charAt(0).toUpperCase() +
                          selectedOtherUser.role.slice(1)}
                      </Badge>
                      <span className="text-sm text-green-600">● Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === state.user?.id}
                        senderName={
                          message.senderId === state.user?.id
                            ? state.user.name
                            : selectedOtherUser.name
                        }
                        senderRole={
                          message.senderId === state.user?.id
                            ? state.user.role
                            : selectedOtherUser.role
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">
                        Send a message to start the conversation
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default ChatInterface;
