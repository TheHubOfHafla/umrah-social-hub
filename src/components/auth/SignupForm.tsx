
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Loader2, UserRound, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["attendee", "organizer"], {
    required_error: "Please select your account type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "attendee",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Signing up with:", values);
      
      // Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: values.role,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created!",
        description: "Welcome to HaflaHub. You've successfully signed up.",
      });
      
      // If the user selected organizer role, we need to create an organizer profile
      if (values.role === "organizer") {
        try {
          const { error: organizerError } = await supabase
            .from('organizers')
            .insert({
              user_id: data.user!.id,
              name: values.name,
            });
            
          if (organizerError) {
            console.error("Error creating organizer profile:", organizerError);
          }
        } catch (err) {
          console.error("Failed to create organizer profile:", err);
        }
      }
      
      // Forward to the appropriate dashboard based on user role
      if (values.role === "organizer") {
        navigate("/organizer");
      } else {
        navigate("/dashboard");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Your full name" 
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
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Email address" 
                      type="email"
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
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
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                      <RadioGroupItem value="attendee" id="attendee" />
                      <label
                        htmlFor="attendee"
                        className="flex flex-1 cursor-pointer items-center gap-2"
                      >
                        <UserRound className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Attendee
                          <p className="text-xs text-muted-foreground mt-1">
                            I want to discover and attend events
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                      <RadioGroupItem value="organizer" id="organizer" />
                      <label
                        htmlFor="organizer"
                        className="flex flex-1 cursor-pointer items-center gap-2"
                      >
                        <Building className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Organizer
                          <p className="text-xs text-muted-foreground mt-1">
                            I want to create and manage events
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
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
                Creating account...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign up
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
