import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const passwordSchema = z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים");

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid password reset session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        toast({
          title: "שגיאה",
          description: "הקישור לאיפוס סיסמה אינו תקף או פג תוקפו",
          variant: "destructive"
        });
        setTimeout(() => navigate("/auth"), 2000);
      }
    });
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast({
        title: "שגיאה",
        description: passwordValidation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "שגיאה",
        description: "הסיסמאות אינן תואמות",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעדכון הסיסמה. אנא נסה שוב.",
        variant: "destructive"
      });
    } else {
      setIsSuccess(true);
      toast({
        title: "הצלחה!",
        description: "הסיסמה שונתה בהצלחה",
      });
      setTimeout(() => navigate("/"), 2000);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">מאמת קישור...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">הסיסמה שונתה בהצלחה!</h2>
          <p className="text-muted-foreground mb-6">מעביר אותך לעמוד הראשי...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      {/* Logo in top right corner */}
      <Link to="/" className="absolute top-6 right-6 z-10">
        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md">
          <span className="text-xl font-extrabold text-primary-foreground">yad2</span>
        </div>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">איפוס סיסמה</h2>
            <p className="text-sm text-muted-foreground">הזן סיסמה חדשה לחשבון שלך</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">סיסמה חדשה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="הקלד/י סיסמה חדשה"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 text-right pr-10 bg-white dark:bg-background border-2 border-gray-200 dark:border-border/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-right">לפחות 6 תווים</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-right block">אימות סיסמה</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="הקלד/י שוב את הסיסמה החדשה"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 text-right pr-10 bg-white dark:bg-background border-2 border-gray-200 dark:border-border/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  מעדכן סיסמה...
                </>
              ) : (
                "עדכן סיסמה"
              )}
            </Button>

            <div className="text-center pt-4">
              <Link
                to="/auth"
                className="text-sm text-primary hover:underline"
              >
                חזרה להתחברות
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
