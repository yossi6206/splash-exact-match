import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, User, Rocket, MessageCircle, Bell, ShoppingCart, Store, Briefcase, Search } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("כתובת אימייל לא תקינה");
const passwordSchema = z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים");
const nameSchema = z.string().min(2, "השם חייב להכיל לפחות 2 תווים");

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
    userType: "buyer" as "buyer" | "seller" | "freelancer" | "service_seeker",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) console.error('Error signing in with Google:', error);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate
    const emailValidation = emailSchema.safeParse(loginData.email);
    const passwordValidation = passwordSchema.safeParse(loginData.password);
    
    if (!emailValidation.success) {
      setErrors(prev => ({ ...prev, loginEmail: emailValidation.error.errors[0].message }));
      return;
    }
    if (!passwordValidation.success) {
      setErrors(prev => ({ ...prev, loginPassword: passwordValidation.error.errors[0].message }));
      return;
    }

    setIsLoading(true);
    await signIn(loginData.email, loginData.password);
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate
    const emailValidation = emailSchema.safeParse(signupData.email);
    const passwordValidation = passwordSchema.safeParse(signupData.password);
    const nameValidation = nameSchema.safeParse(signupData.fullName);
    
    if (!emailValidation.success) {
      setErrors(prev => ({ ...prev, signupEmail: emailValidation.error.errors[0].message }));
      return;
    }
    if (!passwordValidation.success) {
      setErrors(prev => ({ ...prev, signupPassword: passwordValidation.error.errors[0].message }));
      return;
    }
    if (!nameValidation.success) {
      setErrors(prev => ({ ...prev, signupName: nameValidation.error.errors[0].message }));
      return;
    }

    setIsLoading(true);
    await signUp(signupData.email, signupData.password, signupData.fullName, signupData.userType);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative">
      {/* Logo in top right corner */}
      <Link to="/" className="absolute top-6 right-6 z-10">
        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md">
          <span className="text-xl font-extrabold text-primary-foreground">yad2</span>
        </div>
      </Link>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Marketing Content */}
        <div className="hidden lg:flex flex-col gap-10 text-right">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              לקבנות מהר, למכור מהר.
            </h1>
            <p className="text-xl text-muted-foreground">
              ויש לנו אתכלה כלים לזה.
            </p>
          </div>

          <div className="flex items-center justify-start gap-8 mt-4 mr-0">
            <div className="flex flex-col items-center gap-2">
              <User className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground">איזור אישי</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Rocket className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground">פרסום מודעה</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground">צ'אט</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Bell className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground">התראות</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white dark:bg-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">
              היי, טוב לראות אותך
            </h2>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-white dark:bg-background border-2 border-gray-200 dark:border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-all duration-300 group shadow-md hover:shadow-lg"
                onClick={handleGoogleSignIn}
              >
                <svg className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Google</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-white dark:bg-background border-2 border-gray-200 dark:border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-all duration-300 group shadow-md hover:shadow-lg"
              >
                <svg className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-medium">Apple</span>
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-card text-muted-foreground">או התחבר ידנית</span>
              </div>
            </div>

            {/* Login Form */}
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">מייל</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourmail@email.co.il"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-11 text-right bg-white dark:bg-background border-2 border-gray-200 dark:border-border/60"
                    required
                  />
                  {errors.loginEmail && (
                    <p className="text-sm text-destructive text-right">{errors.loginEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">סיסמה</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="הקלד/י סיסמה"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
                  {errors.loginPassword && (
                    <p className="text-sm text-destructive text-right">{errors.loginPassword}</p>
                  )}
                </div>

                <div className="text-right">
                  <button type="button" className="text-sm text-primary hover:underline">
                    שכחתי סיסמה
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    "התחברות"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  אין לך חשבון?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    להרשמה
                  </button>
                </p>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-right block">שם מלא</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="ישראל ישראלי"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="h-11 text-right bg-white dark:bg-background border-2 border-gray-200 dark:border-border/60"
                    required
                  />
                  {errors.signupName && (
                    <p className="text-sm text-destructive text-right">{errors.signupName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-right block">מייל</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="yourmail@email.co.il"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="h-11 text-right bg-white dark:bg-background border-2 border-gray-200 dark:border-border/60"
                    required
                  />
                  {errors.signupEmail && (
                    <p className="text-sm text-destructive text-right">{errors.signupEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-right block">סיסמה</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="הקלד/י סיסמה"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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
                  {errors.signupPassword && (
                    <p className="text-sm text-destructive text-right">{errors.signupPassword}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-right block">אני מתכוון/ת:</Label>
                  <RadioGroup
                    value={signupData.userType}
                    onValueChange={(value) => setSignupData({ ...signupData, userType: value as any })}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-end space-x-2 space-x-reverse p-3 rounded-lg border-2 border-gray-200 dark:border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <Label htmlFor="buyer" className="flex-1 text-right cursor-pointer flex items-center justify-end gap-2">
                        <span>לקנות מוצרים</span>
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                      </Label>
                      <RadioGroupItem value="buyer" id="buyer" />
                    </div>
                    <div className="flex items-center justify-end space-x-2 space-x-reverse p-3 rounded-lg border-2 border-gray-200 dark:border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <Label htmlFor="seller" className="flex-1 text-right cursor-pointer flex items-center justify-end gap-2">
                        <span>למכור ולפרסם מודעות</span>
                        <Store className="w-4 h-4 text-muted-foreground" />
                      </Label>
                      <RadioGroupItem value="seller" id="seller" />
                    </div>
                    <div className="flex items-center justify-end space-x-2 space-x-reverse p-3 rounded-lg border-2 border-gray-200 dark:border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <Label htmlFor="freelancer" className="flex-1 text-right cursor-pointer flex items-center justify-end gap-2">
                        <span>להציע שירותים כפרילנסר</span>
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                      </Label>
                      <RadioGroupItem value="freelancer" id="freelancer" />
                    </div>
                    <div className="flex items-center justify-end space-x-2 space-x-reverse p-3 rounded-lg border-2 border-gray-200 dark:border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <Label htmlFor="service_seeker" className="flex-1 text-right cursor-pointer flex items-center justify-end gap-2">
                        <span>לחפש בעלי מקצוע ושירותים</span>
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </Label>
                      <RadioGroupItem value="service_seeker" id="service_seeker" />
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      נרשם...
                    </>
                  ) : (
                    "הרשמה"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  כבר יש לך חשבון?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    להתחברות
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
