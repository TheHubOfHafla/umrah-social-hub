import { useState } from "react";
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

// Verification code schema
const verificationSchema = z.object({
  verificationCode: z.string().min(4, { message: "Please enter the verification code" }),
});

// Interests schema
const interestsSchema = z.object({
  categories: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
});

type UserInfoValues = z.infer<typeof userInfoSchema>;
type VerificationValues = z.infer<typeof verificationSchema>;
type InterestsValues = z.infer<typeof interestsSchema>;

// Add onSignupSuccess prop
const Signup = ({ onSignupSuccess }: { onSignupSuccess?: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<'userInfo' | 'interests' | 'verification'>('userInfo');
  const [userData, setUserData] = useState<UserInfoValues & { interests?: EventCategory[] } | null>(null);
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

  // Form for verification code
  const verificationForm = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
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
      
      // Store user data with interests
      if (userData) {
        setUserData({
          ...userData,
          interests: selectedInterests as EventCategory[]
        });
      }
      
      console.log("Sending verification code to:", userData?.phone);
      
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random 6-digit code (in a real app, this would be done on the server)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Verification code generated:", verificationCode);
      
      toast({
        title: "Verification code sent!",
        description: `We've sent a verification code to ${userData?.phone}. In a real app, the code would be ${verificationCode}`,
      });
      
      // Move to verification step
      setSignupStep('verification');
    } catch (error) {
      console.error("Interests error:", error);
      setAuthError("Failed to process interests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (values: VerificationValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Verifying code:", values.verificationCode);
      
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
        // Note: The trigger we created will create a basic profile, but we need to update it with additional info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            phone: userData.phone,
            city: userData.city,
            interests: userData.interests,
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error("Profile update error:", profileError);
        }
        
        toast({
          title: "Account created!",
          description: "You have successfully signed up.",
        });
        
        // Call the onSignupSuccess callback if provided
        if (onSignupSuccess) {
          onSignupSuccess();
        }
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to verify code. Please try again.");
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
    
    // Get the phone number value from the form
    const phoneNumber = userInfoForm.getValues("phone");
    
    // Validate the phone number before proceeding
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneValidationError("Please enter a valid phone number before signing up with Google");
      setIsLoading(false);
      return;
    }
    
    try {
      // Store partial user data and move to interests step
      setUserData({
        name: userInfoForm.getValues("name") || "Google User",
        email: userInfoForm.getValues("email") || "",
        password: "", // Not needed for Google auth
        confirmPassword: "",
        city: userInfoForm.getValues("city") || "",
        phone: phoneNumber,
      });
      
      setSignupStep('interests');
    } catch (error) {
      console.error("Google sign-up error:", error);
      setAuthError("Failed to sign up with Google. Please try again.");
    } finally {
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
        ) : signupStep === 'interests' ? (
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
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Continue
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-md text-sm">
                <p>We've sent a verification code to <strong>{userData?.phone}</strong>.</p>
                <p className="mt-2">In a real app, this would actually send an SMS code to your phone.</p>
              </div>
              
              <FormField
                control={verificationForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter code" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Complete Signup
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
