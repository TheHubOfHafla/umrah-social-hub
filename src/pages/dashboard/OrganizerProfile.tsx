
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import { currentUser } from "@/lib/data/users";
import { Link } from "react-router-dom";
import { Save, Building, MapPin, Globe, Share2 } from "lucide-react";

const OrganizerProfile = () => {
  useEffect(() => {
    document.title = "Organizer Profile | Islamic Social";
  }, []);

  return (
    <DashboardLayout user={currentUser} type="organizer">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizer Profile</h1>
          <p className="text-muted-foreground">
            Manage your organizer profile and settings
          </p>
        </div>

        <Tabs defaultValue="profile">
          <div className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Organization Information
                </CardTitle>
                <CardDescription>
                  Update your organization details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <UserAvatar user={currentUser} size="xl" />
                  <div>
                    <Button size="sm">Change Avatar</Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Recommended size: 300x300px. Max file size: 5MB.
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        placeholder="Your organization name"
                        defaultValue="Islamic Community Center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Organization Type</Label>
                      <Select defaultValue="mosque">
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mosque">Mosque</SelectItem>
                          <SelectItem value="charity">Charity</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="influencer">Influencer</SelectItem>
                          <SelectItem value="scholar">Scholar</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About the Organization</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your organization"
                      className="min-h-32"
                      defaultValue="We are a community center dedicated to providing Islamic education and social services."
                    />
                  </div>
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
                  Contact & Location
                </CardTitle>
                <CardDescription>
                  Update contact information and location details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Contact email"
                      defaultValue="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Contact phone"
                      defaultValue="+44 123 456 7890"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      defaultValue="London"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      defaultValue="United Kingdom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      placeholder="Postal Code"
                      defaultValue="SW1A 1AA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    defaultValue="123 Example Street, London, SW1A 1AA"
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
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Website & Social Media
                </CardTitle>
                <CardDescription>
                  Update your website and social media links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://www.example.com"
                    defaultValue="https://www.example.com"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="Facebook profile URL"
                      defaultValue="https://facebook.com/example"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="Twitter profile URL"
                      defaultValue="https://twitter.com/example"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="Instagram profile URL"
                      defaultValue="https://instagram.com/example"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      placeholder="YouTube channel URL"
                      defaultValue="https://youtube.com/c/example"
                    />
                  </div>
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
                  <Share2 className="mr-2 h-5 w-5" />
                  Brand Assets
                </CardTitle>
                <CardDescription>
                  Upload and manage your brand assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label>Logo</Label>
                    <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <Button size="sm" variant="outline">
                          Upload Logo
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          SVG, PNG or JPG (max. 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Cover Image</Label>
                    <div className="flex aspect-video items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <Button size="sm" variant="outline">
                          Upload Cover
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          1280x720 or higher recommended (max. 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Brand Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      defaultValue="#4338ca"
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      defaultValue="#4338ca"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerProfile;
