import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, AlertCircle, Loader2, Github, MapPin, Phone, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data/categories";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";

// Basic user information form schema
const userInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  city: z.string().min(2, { message: "Please enter your city" }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\+?[0-9\s\-()]+$/, { message: "Please enter a valid phone number" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Interests schema
const interestsSchema = z.object({
  categories: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
});

type UserInfoValues = z.infer<typeof userInfoSchema>;
type InterestsValues = z.infer<typeof interestsSchema>;

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<'userInfo' | 'interests'>('userInfo');
  const [userData, setUserData] = useState<UserInfoValues | null>(null);
  const [phoneValidationError, setPhoneValidationError] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<EventCategory[]>([]);

  // Form for user information
  const userInfoForm = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
      phone: "",
    },
  });

  // Form for interests
  const interestsForm = useForm<InterestsValues>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      categories: [],
    },
  });

  const handleUserInfoSubmit = async (values: UserInfoValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("User info submitted:", values);
      
      // Store user data for later submission
      setUserData(values);
      // Move to interests step
      setSignupStep('interests');
    } catch (error) {
      console.error("User info error:", error);
      setAuthError("Failed to process user information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestsSubmit = async (values: InterestsValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Interests submitted:", values);
      
      if (!userData) {
        throw new Error("User data not found");
      }
      
      // Register the user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData.user) {
        // Update the user's profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            phone: userData.phone,
            city: userData.city,
            country: '',
            interests: selectedInterests as string[],
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error("Profile update error:", profileError);
        }
        
        // After successful signup, immediately sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        });
        
        if (signInError) {
          console.error("Auto sign-in error:", signInError);
          // Show success message but don't redirect automatically if auto-login fails
          toast({
            title: "Account created!",
            description: "You have successfully signed up. Please sign in to continue.",
          });
          navigate("/login");
        } else {
          // Successfully signed up and logged in
          toast({
            title: "Welcome to EventHub!",
            description: "Your account has been created and you're now signed in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (category: EventCategory) => {
    let newInterests: EventCategory[];
    
    if (selectedInterests.includes(category)) {
      newInterests = selectedInterests.filter(c => c !== category);
    } else {
      newInterests = [...selectedInterests, category];
    }
    
    setSelectedInterests(newInterests);
    interestsForm.setValue("categories", newInterests as string[]);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setAuthError(null);
    setPhoneValidationError(null);
    
    try {
      // Sign up with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      setAuthError(error.message || "Failed to sign up with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-background/90">
      <div className="w-full max-w-md space-y-8 bg-card rounded-lg shadow-lg p-8 border border-border">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary">EventHub</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Sign up</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account to start using EventHub
          </p>
        </div>

        {authError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* User Info Step */}
        {signupStep === 'userInfo' ? (
          <Form {...userInfoForm}>
            <form onSubmit={userInfoForm.handleSubmit(handleUserInfoSubmit)} className="space-y-6">
              <FormField
                control={userInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Full name" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Email address" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={userInfoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Your city" 
                            className="pl-10" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userInfoForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            className="pl-10" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {phoneValidationError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{phoneValidationError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={userInfoForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Password" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 px-0"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userInfoForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm password" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 px-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continue
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...interestsForm}>
            <form onSubmit={interestsForm.handleSubmit(handleInterestsSubmit)} className="space-y-6">
              <div>
                <FormLabel className="flex items-center mb-3">
                  <Heart className="mr-2 h-4 w-4 text-primary" />
                  Select Your Interests
                </FormLabel>
                
                <FormDescription className="text-sm text-muted-foreground mb-4">
                  Select categories that interest you to personalize your event recommendations.
                </FormDescription>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedInterests.includes(category.value) ? "default" : "outline"}
                      className="cursor-pointer text-sm py-1.5 px-2.5"
                      onClick={() => toggleInterest(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
                
                {interestsForm.formState.errors.categories && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {interestsForm.formState.errors.categories.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSignupStep('userInfo')}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading || selectedInterests.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {signupStep === 'userInfo' && (
          <>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
