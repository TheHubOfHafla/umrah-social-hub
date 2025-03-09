
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { fetchCurrentUser, updateUserProfile } from "@/lib/data/users";
import { Link } from "react-router-dom";
import { Save, User, MapPin, Heart, LogOut, Loader2 } from "lucide-react";
import { EventCategory, User as UserType } from "@/types";
import { categories } from "@/lib/data/categories";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { onSignOut } = useContext(AuthContext);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  
  useEffect(() => {
    document.title = "My Profile | Islamic Social";
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setBio(""); // Bio is not in the current schema
        setCity(userData.location?.city || "");
        setCountry(userData.location?.country || "");
        setSelectedCategories(userData.interests || []);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Call the sign out function from context
      onSignOut();
      
      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const success = await updateUserProfile(user.id, {
        name,
        location: {
          city,
          country,
        },
        interests: selectedCategories,
      });
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout user={user} type="user">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-32"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Location & Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location & Preferences
              </CardTitle>
              <CardDescription>
                Set your location and event preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-primary" />
                  Event Interests
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
