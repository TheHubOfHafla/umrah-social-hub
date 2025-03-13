
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { currentUser } from "@/lib/data/users";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  organizationType: z.enum([
    "individual", 
    "mosque", 
    "charity", 
    "company", 
    "influencer", 
    "scholar"
  ]),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
});

const OrganizerSignup = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      organizationType: "individual",
      bio: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // Insert into organizers table
      const { data, error } = await supabase
        .from("organizers")
        .insert({
          user_id: user.id,
          name: values.name,
          organization_type: values.organizationType,
          bio: values.bio,
          website: values.website || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      // Update user role to organizer
      if (!error) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: "organizer" })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw new Error("Failed to update profile.");
        }

        toast({
          title: "Success!",
          description: "Your organizer account has been created.",
        });

        // Redirect to the organizer dashboard
        navigate("/organizer");
        
        // Refresh the page to update auth context
        window.location.reload();
      } else {
        console.error("Error creating organizer:", error);
        throw new Error("Failed to create organizer profile.");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your organizer account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout user={user || currentUser} type="user">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Become an Organizer
            </CardTitle>
            <CardDescription>
              Fill out the form below to apply for an organizer account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your organization name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be displayed publicly on your events
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="organizationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="mosque">Mosque</SelectItem>
                          <SelectItem value="charity">Charity</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="influencer">Influencer</SelectItem>
                          <SelectItem value="scholar">Scholar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type that best describes your organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your organization (500 characters max)" 
                          className="resize-none min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear on your organizer profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your organization's website or social media link
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-xs text-muted-foreground">
              By submitting this application, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerSignup;
