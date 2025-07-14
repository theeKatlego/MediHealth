import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  senderName: string;
  senderRole?: string;
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
  senderRole,
}: MessageBubbleProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role?: string) => {
    if (role === "doctor") return "bg-blue-100 text-blue-800";
    if (role === "patient") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3 mb-4",
        isOwn ? "flex-row-reverse space-x-reverse" : "",
      )}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {senderName}
            </span>
            {senderRole && (
              <Badge className={cn("text-xs", getRoleColor(senderRole))}>
                {senderRole.charAt(0).toUpperCase() + senderRole.slice(1)}
              </Badge>
            )}
          </div>
        )}

        <div
          className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
            isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900",
          )}
        >
          {message.type === "text" ? (
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm">📎 Attachment</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center space-x-1 mt-1 text-xs text-gray-500",
            isOwn ? "flex-row-reverse space-x-reverse" : "",
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && !message.isRead && <span className="text-blue-500">•</span>}
          {isOwn && message.isRead && <span className="text-green-500">✓</span>}
        </div>
      </div>

      {isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-green-500 text-white text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
