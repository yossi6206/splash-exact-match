import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { useState } from "react";

interface ConversationItemProps {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount?: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export const ConversationItem = ({
  id,
  otherUserName,
  otherUserAvatar,
  lastMessage,
  lastMessageAt,
  unreadCount = 0,
  isSelected,
  onClick,
  onDelete,
}: ConversationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: string | null) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false, locale: he });
    } catch {
      return "";
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 border-b relative ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      {isHovered && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="absolute left-2 top-2 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={otherUserAvatar || ""} alt={otherUserName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(otherUserName)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{otherUserName}</h3>
          {lastMessageAt && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(lastMessageAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <p 
            className="text-sm text-muted-foreground flex-1 overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              maxHeight: '1.5em',
              lineHeight: '1.5em'
            }}
          >
            {lastMessage || "אין הודעות עדיין"}
          </p>
          {unreadCount > 0 && (
            <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-xs flex-shrink-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
