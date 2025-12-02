import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "שגיאה בהתחברות",
          description: error.message === "Invalid login credentials" 
            ? "אימייל או סיסמה שגויים" 
            : error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "התחברת בהצלחה!",
        description: "ברוך הבא חזרה",
      });
      
      navigate("/");
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "המשתמש כבר קיים",
            description: "כתובת האימייל הזו כבר רשומה במערכת",
            variant: "destructive",
          });
        } else {
          toast({
            title: "שגיאה ברישום",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      // Update profile with user_type after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ user_type: userType })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Send welcome email
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: { 
              email: email,
              name: fullName
            }
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't block signup if email fails
        }
      }

      toast({
        title: "נרשמת בהצלחה!",
        description: "ברוך הבא למערכת",
      });
      
      navigate("/");
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "התנתקת בהצלחה",
      description: "להתראות!",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
