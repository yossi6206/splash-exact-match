import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";

const emailSchema = z.string().email("כתובת אימייל לא תקינה");
const passwordSchema = z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים");
const nameSchema = z.string().min(2, "השם חייב להכיל לפחות 2 תווים");

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    await signUp(signupData.email, signupData.password, signupData.fullName);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">ברוכים הבאים</CardTitle>
          <CardDescription>היכנס או הירשם כדי להמשיך</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">התחברות</TabsTrigger>
              <TabsTrigger value="signup">הרשמה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">אימייל</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                  {errors.loginEmail && (
                    <p className="text-sm text-destructive">{errors.loginEmail}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">סיסמה</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  {errors.loginPassword && (
                    <p className="text-sm text-destructive">{errors.loginPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    "התחבר"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">שם מלא</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="ישראל ישראלי"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                  {errors.signupName && (
                    <p className="text-sm text-destructive">{errors.signupName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">אימייל</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                  {errors.signupEmail && (
                    <p className="text-sm text-destructive">{errors.signupEmail}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">סיסמה</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  {errors.signupPassword && (
                    <p className="text-sm text-destructive">{errors.signupPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      נרשם...
                    </>
                  ) : (
                    "הירשם"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
