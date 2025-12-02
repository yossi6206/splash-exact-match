import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock, Phone, Mail, Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z.string().regex(/^[0-9\-+\s]*$/, "מספר טלפון לא תקין").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  newPassword: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  confirmPassword: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "הסיסמאות לא תואמות",
  path: ["confirmPassword"],
});

const DashboardProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Errors
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
      setEmail(user.email || "");
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    
    // Validate
    const result = profileSchema.safeParse({ full_name: fullName, phone });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setProfileErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user!.id,
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("הפרטים עודכנו בהצלחה");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("שגיאה בעדכון הפרטים");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    
    // Validate
    const result = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setPasswordErrors(errors);
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("הסיסמה שונתה בהצלחה");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "שגיאה בשינוי הסיסמה");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">עדכון פרטים</h1>
      <p className="text-muted-foreground mb-6">עדכן את הפרטים האישיים שלך וסיסמה</p>

      <div className="space-y-6">
        {/* Profile Information Card */}
        <Card className="bg-white border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">פרטים אישיים</CardTitle>
                <CardDescription>עדכן את הפרטים האישיים שלך</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  אימייל
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">לא ניתן לשנות את האימייל</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  שם מלא
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="הזן את שמך המלא"
                  className={profileErrors.full_name ? "border-red-500" : ""}
                />
                {profileErrors.full_name && (
                  <p className="text-xs text-red-500">{profileErrors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  טלפון
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="הזן מספר טלפון"
                  className={profileErrors.phone ? "border-red-500" : ""}
                />
                {profileErrors.phone && (
                  <p className="text-xs text-red-500">{profileErrors.phone}</p>
                )}
              </div>

              <Button type="submit" disabled={saving} className="w-full md:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    שמור שינויים
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="bg-white border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">שינוי סיסמה</CardTitle>
                <CardDescription>עדכן את הסיסמה שלך לאבטחה מירבית</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="הזן סיסמה נוכחית"
                    className={passwordErrors.currentPassword ? "border-red-500 pl-10" : "pl-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">סיסמה חדשה</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="הזן סיסמה חדשה"
                    className={passwordErrors.newPassword ? "border-red-500 pl-10" : "pl-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">אימות סיסמה חדשה</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="הזן שוב את הסיסמה החדשה"
                    className={passwordErrors.confirmPassword ? "border-red-500 pl-10" : "pl-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">דרישות סיסמה:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className={`flex items-center gap-2 ${newPassword.length >= 6 ? "text-green-600" : ""}`}>
                    <CheckCircle className={`h-3 w-3 ${newPassword.length >= 6 ? "text-green-600" : "text-muted-foreground"}`} />
                    לפחות 6 תווים
                  </li>
                  <li className={`flex items-center gap-2 ${newPassword === confirmPassword && newPassword.length > 0 ? "text-green-600" : ""}`}>
                    <CheckCircle className={`h-3 w-3 ${newPassword === confirmPassword && newPassword.length > 0 ? "text-green-600" : "text-muted-foreground"}`} />
                    סיסמאות תואמות
                  </li>
                </ul>
              </div>

              <Button type="submit" disabled={changingPassword} variant="secondary" className="w-full md:w-auto">
                {changingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    משנה סיסמה...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 ml-2" />
                    שנה סיסמה
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProfile;
