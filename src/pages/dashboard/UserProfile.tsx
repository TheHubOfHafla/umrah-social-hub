
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { currentUser } from "@/lib/data";
import { Link } from "react-router-dom";
import { Save, User, MapPin, Heart } from "lucide-react";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  useEffect(() => {
    document.title = "My Profile | Islamic Social";
  }, []);

  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(
    currentUser.interests || []
  );

  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <DashboardLayout user={currentUser} type="user">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
                    defaultValue={currentUser.name}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    defaultValue="user@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-32"
                  defaultValue="I'm interested in Islamic events and activities in my community."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

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
                    defaultValue={currentUser.location?.city || ""}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Your country"
                    defaultValue={currentUser.location?.country || ""}
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
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
