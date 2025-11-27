import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { User, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Comment {
  id: string;
  tip_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface TipCommentsProps {
  tipId: string;
}

const TipComments = ({ tipId }: TipCommentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [tipId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tip_comments")
        .select("*")
        .eq("tip_id", tipId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לטעון את התגובות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "עליך להתחבר כדי להוסיף תגובה",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא כתוב תגובה",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("tip_comments")
        .insert({
          tip_id: tipId,
          user_id: user.id,
          comment: newComment.trim(),
        });

      if (error) throw error;

      toast({
        title: "תגובה נוספה בהצלחה",
        description: "התגובה שלך פורסמה",
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להוסיף את התגובה",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("tip_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "התגובה נמחקה",
        description: "התגובה הוסרה בהצלחה",
      });

      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו למחוק את התגובה",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          תגובות ({comments.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="שתף את החוויה שלך או טיפים נוספים..."
            className="mb-4 min-h-[100px] resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {newComment.length}/1000 תווים
            </span>
            <Button 
              type="submit" 
              disabled={submitting || !newComment.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? "מפרסם..." : "פרסם תגובה"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-muted/30 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">
            עליך להתחבר כדי להוסיף תגובה
          </p>
          <Link to="/auth">
            <Button variant="default">התחבר</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          טוען תגובות...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>אין תגובות עדיין. היה הראשון להגיב!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id}
              className="border-2 border-gray-100 dark:border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      משתמש
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: he,
                      })}
                    </p>
                  </div>
                </div>
                
                {user?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TipComments;
