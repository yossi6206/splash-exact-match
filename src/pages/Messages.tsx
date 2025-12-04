import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ConversationsList } from "@/components/ConversationsList";
import { FreelancerChat } from "@/components/FreelancerChat";
import MobileHeader from "@/components/MobileHeader";
import { MessageSquare, ArrowRight, MapPin, Calendar, Star, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count?: number;
  is_freelancer_view?: boolean;
}

interface FreelancerDetails {
  id: string;
  full_name: string;
  title: string;
  category: string;
  location: string | null;
  hourly_rate: number;
  rating: number | null;
  total_reviews: number | null;
  experience_years: number | null;
  skills: string[];
  languages: string[] | null;
  avatar_url: string | null;
  created_at: string;
}

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<{
    conversationId: string;
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar: string | null;
    isFreelancerView: boolean;
  } | null>(null);
  const [freelancerDetails, setFreelancerDetails] = useState<FreelancerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we were navigated here with a specific seller or freelancer
  useEffect(() => {
    const state = location.state as {
      freelancerId?: string;
      freelancerName?: string;
      freelancerAvatar?: string;
      sellerId?: string;
      sellerName?: string;
      itemId?: string;
    };

    const searchParams = new URLSearchParams(location.search);
    const sellerIdFromUrl = searchParams.get("seller");
    const itemIdFromUrl = searchParams.get("item");

    if (state?.freelancerId && user) {
      // Initialize conversation with the specified freelancer
      initializeSpecificConversation(
        state.freelancerId,
        state.freelancerName || "פרילנסר",
        state.freelancerAvatar || null
      );
    } else if ((state?.sellerId || sellerIdFromUrl) && user) {
      // Initialize conversation with a seller
      const sellerId = state?.sellerId || sellerIdFromUrl;
      initializeSellerConversation(sellerId!, itemIdFromUrl || undefined);
    }
  }, [location.state, location.search, user]);

  useEffect(() => {
    if (user) {
      loadConversations();
      subscribeToConversations();
    }
  }, [user]);

  // Fetch freelancer details when conversation is selected
  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      if (!selectedConversation || selectedConversation.isFreelancerView) {
        setFreelancerDetails(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("freelancers")
          .select("*")
          .eq("id", selectedConversation.otherUserId)
          .single();

        if (error) {
          console.error("Error fetching freelancer details:", error);
          setFreelancerDetails(null);
          return;
        }

        setFreelancerDetails(data);
      } catch (error) {
        console.error("Error fetching freelancer details:", error);
        setFreelancerDetails(null);
      }
    };

    fetchFreelancerDetails();
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Get conversations where user is client
      const { data: clientConversations, error: clientError } = await supabase
        .from("conversations")
        .select(
          `
          id,
          freelancer_id,
          last_message_at,
          freelancers (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .eq("client_id", user.id)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (clientError) throw clientError;

      // Get conversations where user is freelancer
      const { data: freelancerProfile } = await supabase
        .from("freelancers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let freelancerConversations: any[] = [];
      if (freelancerProfile) {
        const { data: conversations, error } = await supabase
          .from("conversations")
          .select("id, client_id, last_message_at")
          .eq("freelancer_id", freelancerProfile.id)
          .order("last_message_at", { ascending: false, nullsFirst: false });

        if (!error && conversations) {
          // Get client profiles separately
          const clientIds = conversations.map(c => c.client_id);
          const { data: clientProfiles } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", clientIds);

          freelancerConversations = conversations.map((conv: any) => {
            const profile = clientProfiles?.find(p => p.id === conv.client_id);
            return {
              ...conv,
              profiles: profile || { id: conv.client_id, full_name: "לקוח", avatar_url: null }
            };
          });
        }
      }

      // Combine conversations - user as client and as freelancer
      const allConversations = [
        ...(clientConversations || []).map((conv: any) => ({
          id: conv.id,
          other_user_id: conv.freelancer_id,
          other_user_name: conv.freelancers?.full_name || "פרילנסר",
          other_user_avatar: conv.freelancers?.avatar_url || null,
          last_message_at: conv.last_message_at,
          is_freelancer_view: false,
        })),
        ...freelancerConversations.map((conv: any) => ({
          id: conv.id,
          other_user_id: conv.client_id,
          other_user_name: conv.profiles?.full_name || "לקוח",
          other_user_avatar: conv.profiles?.avatar_url || null,
          last_message_at: conv.last_message_at,
          is_freelancer_view: true,
        })),
      ];

      // Get last message for each conversation
      const conversationsWithMessages = await Promise.all(
        allConversations.map(async (conv) => {
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            last_message: lastMessage?.content || null,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const initializeSpecificConversation = async (
    freelancerId: string,
    freelancerName: string,
    freelancerAvatar: string | null
  ) => {
    if (!user) return;

    try {
      // Check if conversation exists
      const { data: existingConv, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("client_id", user.id)
        .eq("freelancer_id", freelancerId)
        .maybeSingle();

      if (convError && convError.code !== "PGRST116") {
        throw convError;
      }

      let conversationId = existingConv?.id;

      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from("conversations")
          .insert({
            client_id: user.id,
            freelancer_id: freelancerId,
          })
          .select("id")
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;
      }

      // Set the selected conversation
      setSelectedConversation({
        conversationId,
        otherUserId: freelancerId,
        otherUserName: freelancerName,
        otherUserAvatar: freelancerAvatar,
        isFreelancerView: false,
      });

      // Reload conversations to show the new one in the list
      loadConversations();
    } catch (error) {
      console.error("Error initializing specific conversation:", error);
    }
  };

  const initializeSellerConversation = async (sellerId: string, itemId?: string) => {
    if (!user) return;

    try {
      // Get seller profile info
      const { data: sellerProfile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", sellerId)
        .single();

      // Check if seller is a freelancer
      const { data: freelancerProfile } = await supabase
        .from("freelancers")
        .select("id")
        .eq("user_id", sellerId)
        .maybeSingle();

      if (freelancerProfile) {
        // If seller is a freelancer, use freelancer conversation system
        initializeSpecificConversation(
          freelancerProfile.id,
          sellerProfile?.full_name || "מוכר",
          sellerProfile?.avatar_url || null
        );
      } else {
        // For non-freelancer sellers, we need to create a direct user-to-user conversation
        // Check existing conversations where both users are involved
        const { data: existingConversations } = await supabase
          .from("conversations")
          .select("id, client_id, freelancer_id, freelancers(user_id)")
          .or(`client_id.eq.${user.id},client_id.eq.${sellerId}`)
          .order("last_message_at", { ascending: false, nullsFirst: false });

        // Find if there's any conversation between these two users
        let conversationId = null;
        let isFreelancerView = false;

        if (existingConversations) {
          for (const conv of existingConversations as any[]) {
            const freelancerUserId = conv.freelancers?.user_id;
            if (
              (conv.client_id === user.id && freelancerUserId === sellerId) ||
              (conv.client_id === sellerId && freelancerUserId === user.id)
            ) {
              conversationId = conv.id;
              isFreelancerView = freelancerUserId === user.id;
              break;
            }
          }
        }

        // If no conversation exists, we can't create one without a freelancer profile
        // Show a message to the user
        if (!conversationId) {
          alert("לא ניתן לשלוח הודעה למשתמש זה. המוכר צריך להיות רשום כפרילנסר כדי לקבל הודעות.");
          return;
        }

        setSelectedConversation({
          conversationId,
          otherUserId: sellerId,
          otherUserName: sellerProfile?.full_name || "מוכר",
          otherUserAvatar: sellerProfile?.avatar_url || null,
          isFreelancerView,
        });

        loadConversations();
      }
    } catch (error) {
      console.error("Error initializing seller conversation:", error);
    }
  };

  const handleSelectConversation = (
    conversationId: string,
    otherUserId: string,
    otherUserName: string,
    otherUserAvatar: string | null,
    isFreelancerView: boolean
  ) => {
    setSelectedConversation({
      conversationId,
      otherUserId,
      otherUserName,
      otherUserAvatar,
      isFreelancerView,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background pb-20 md:pb-0">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Header */}
      <header className="hidden md:flex h-16 border-b items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">הודעות</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row min-h-0">
        {/* Conversations List - Full width on mobile when no conversation selected */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-96 flex-shrink-0 md:border-l h-full overflow-hidden`}>
          <ConversationsList
            conversations={conversations}
            selectedConversationId={selectedConversation?.conversationId || null}
            onSelectConversation={handleSelectConversation}
            onConversationDeleted={() => {
              loadConversations();
              setSelectedConversation(null);
            }}
          />
        </div>

        {/* Chat Area - Full width on mobile when conversation selected */}
        <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1 min-h-0`}>
          {selectedConversation ? (
            <div className="w-full h-full flex min-h-0">
              {/* Main Chat Section */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Chat Header - Shows who you're talking to */}
                <div className="flex items-center gap-3 p-4 border-b bg-card flex-shrink-0">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  
                  {/* Avatar */}
                  {selectedConversation.otherUserAvatar ? (
                    <img 
                      src={selectedConversation.otherUserAvatar} 
                      alt={selectedConversation.otherUserName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {selectedConversation.otherUserName.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  
                  {/* Name and status */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{selectedConversation.otherUserName}</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedConversation.isFreelancerView ? "לקוח" : "בעל מקצוע"}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0">
                  <FreelancerChat
                    conversationId={selectedConversation.conversationId}
                    otherUserId={selectedConversation.otherUserId}
                    otherUserName={selectedConversation.otherUserName}
                    otherUserAvatar={selectedConversation.otherUserAvatar}
                    isFreelancerView={selectedConversation.isFreelancerView}
                    open={true}
                    onOpenChange={() => setSelectedConversation(null)}
                    embedded={true}
                  />
                </div>
              </div>

              {/* Freelancer Details Sidebar - Desktop only */}
              {freelancerDetails && !selectedConversation.isFreelancerView && (
                <div className="hidden lg:block w-80 border-r bg-card overflow-y-auto">
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="text-center">
                      {freelancerDetails.avatar_url ? (
                        <img 
                          src={freelancerDetails.avatar_url} 
                          alt={freelancerDetails.full_name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-medium text-primary">
                            {freelancerDetails.full_name.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-lg">{freelancerDetails.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{freelancerDetails.title}</p>
                      
                      {/* Rating - Prominent display */}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">
                          {freelancerDetails.rating ? Number(freelancerDetails.rating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({freelancerDetails.total_reviews || 0} ביקורות)
                        </span>
                      </div>
                      
                      <Badge variant="secondary" className="mt-2">{freelancerDetails.category}</Badge>
                    </div>

                    <Separator />

                    {/* Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">אודות {freelancerDetails.full_name}</h4>
                      
                      {freelancerDetails.location && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            מיקום
                          </span>
                          <span className="font-medium">{freelancerDetails.location}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          חבר מאז
                        </span>
                        <span className="font-medium">
                          {new Date(freelancerDetails.created_at).toLocaleDateString('he-IL', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      {freelancerDetails.experience_years && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            ניסיון
                          </span>
                          <span className="font-medium">{freelancerDetails.experience_years} שנים</span>
                        </div>
                      )}

                      {freelancerDetails.languages && freelancerDetails.languages.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            שפות
                          </span>
                          <span className="font-medium">{freelancerDetails.languages.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Stats */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">נתונים</h4>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">תעריף שעתי</span>
                        <span className="font-medium">₪{freelancerDetails.hourly_rate}</span>
                      </div>

                      {freelancerDetails.rating !== null && freelancerDetails.rating > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">דירוג</span>
                          <span className="font-medium flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {Number(freelancerDetails.rating).toFixed(1)}
                            {freelancerDetails.total_reviews && freelancerDetails.total_reviews > 0 && (
                              <span className="text-muted-foreground">
                                ({freelancerDetails.total_reviews})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {freelancerDetails.skills && freelancerDetails.skills.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">מיומנויות</h4>
                          <div className="flex flex-wrap gap-1">
                            {freelancerDetails.skills.slice(0, 6).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* View Profile Button */}
                    <Link to={`/freelancers/${freelancerDetails.id}`}>
                      <Button variant="outline" className="w-full mt-4">
                        צפה בפרופיל מלא
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="mx-auto w-32 h-32 rounded-full bg-muted/30 flex items-center justify-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/40" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">המשך מאיפה שעצרת</h3>
                  <p className="text-muted-foreground">
                    בחר שיחה ותוכל להמשיך לצ'אט
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
