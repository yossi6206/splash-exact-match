import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface ConversationItemProps {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount?: number;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem = ({
  freelancerName,
  freelancerAvatar,
  lastMessage,
  lastMessageAt,
  unreadCount = 0,
  isSelected,
  onClick,
}: ConversationItemProps) => {
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

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 border-b ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={freelancerAvatar || ""} alt={freelancerName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(freelancerName)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{freelancerName}</h3>
          {lastMessageAt && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(lastMessageAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage || "אין הודעות עדיין"}
          </p>
          {unreadCount > 0 && (
            <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
