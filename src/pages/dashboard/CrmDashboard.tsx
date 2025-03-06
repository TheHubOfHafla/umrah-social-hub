
import { useState, useMemo } from "react";
import { 
  Users, Filter, Search, Download, Mail, MessageSquare, MoreHorizontal,
  MapPin, Calendar, Tag
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { currentUser } from "@/lib/data";
import { EventCategory, User } from "@/types";
import UserAvatar from "@/components/UserAvatar";

// Mock users data (in a real app, this would come from your database)
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Ahmed Mohamed",
    avatar: "/placeholder.svg",
    interests: ["charity", "education", "travel"],
    location: {
      city: "London",
      country: "United Kingdom",
    },
    following: ["org1", "org2"],
    eventsAttending: ["event1", "event2"],
    email: "ahmed@example.com",
    phone: "+44 7700 900077",
    signupDate: "2023-04-15",
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    interests: ["mosque", "lecture", "education"],
    location: {
      city: "Manchester",
      country: "United Kingdom",
    },
    following: ["org2", "org3"],
    eventsAttending: ["event3", "event4"],
    email: "sarah@example.com",
    phone: "+44 7700 900088",
    signupDate: "2023-05-20",
  },
  {
    id: "user3",
    name: "Yusuf Khan",
    avatar: "/placeholder.svg",
    interests: ["travel", "umrah", "workshop"],
    location: {
      city: "Birmingham",
      country: "United Kingdom",
    },
    following: ["org1", "org4"],
    eventsAttending: ["event2", "event5"],
    email: "yusuf@example.com",
    phone: "+44 7700 900099",
    signupDate: "2023-06-10",
  },
  {
    id: "user4",
    name: "Fatima Hassan",
    avatar: "/placeholder.svg",
    interests: ["charity", "social", "community"],
    location: {
      city: "London",
      country: "United Kingdom",
    },
    following: ["org2", "org5"],
    eventsAttending: ["event1", "event6"],
    email: "fatima@example.com",
    phone: "+44 7700 900066",
    signupDate: "2023-07-05",
  },
  {
    id: "user5",
    name: "Mohammad Patel",
    avatar: "/placeholder.svg",
    interests: ["lecture", "workshop", "education"],
    location: {
      city: "Leeds",
      country: "United Kingdom",
    },
    following: ["org3", "org6"],
    eventsAttending: ["event7", "event8"],
    email: "mohammad@example.com",
    phone: "+44 7700 900055",
    signupDate: "2023-08-12",
  },
];

// Define cities for filtering
const cities = ["All Cities", "London", "Manchester", "Birmingham", "Leeds"];

// Define categories for filtering from our EventCategory type
const categories: { value: EventCategory; label: string }[] = [
  { value: "charity", label: "Charity" },
  { value: "community", label: "Community" },
  { value: "education", label: "Education" },
  { value: "mosque", label: "Mosque" },
  { value: "travel", label: "Travel" },
  { value: "umrah", label: "Umrah" },
  { value: "lecture", label: "Lecture" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

const CrmDashboard = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState<boolean>(false);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState<boolean>(false);

  // Apply filters to users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Filter by search query
      const matchesSearch = 
        searchQuery === "" || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery);
      
      // Filter by city
      const matchesCity = 
        selectedCity === "All Cities" || 
        user.location?.city === selectedCity;
      
      // Filter by interest category
      const matchesCategory = 
        !selectedCategory || 
        user.interests?.includes(selectedCategory as EventCategory);
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [searchQuery, selectedCity, selectedCategory]);

  // Handle selecting all users
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Handle selecting individual user
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Get selected users data
  const getSelectedUsersData = () => {
    return mockUsers.filter(user => selectedUsers.includes(user.id));
  };

  // Handle sending email
  const handleSendEmail = () => {
    const recipients = getSelectedUsersData();
    console.log("Sending email to:", recipients);
    console.log("Subject:", emailSubject);
    console.log("Body:", emailBody);
    
    toast({
      title: "Emails queued for sending",
      description: `Email will be sent to ${recipients.length} recipients.`,
    });
    
    setIsEmailDialogOpen(false);
    setEmailSubject("");
    setEmailBody("");
  };

  // Handle sending SMS
  const handleSendSms = () => {
    const recipients = getSelectedUsersData();
    console.log("Sending SMS to:", recipients);
    console.log("Message:", messageText);
    
    toast({
      title: "SMS queued for sending",
      description: `SMS will be sent to ${recipients.length} recipients.`,
    });
    
    setIsSmsDialogOpen(false);
    setMessageText("");
  };

  // Export user data as CSV
  const exportCsv = () => {
    const users = selectedUsers.length > 0 ? getSelectedUsersData() : filteredUsers;
    const headers = ["Name", "Email", "Phone", "City", "Interests", "Signup Date"];
    
    const csvContent = [
      headers.join(","),
      ...users.map(user => [
        `"${user.name}"`,
        `"${user.email || ''}"`,
        `"${user.phone || ''}"`,
        `"${user.location?.city || ''}"`,
        `"${user.interests?.join(', ') || ''}"`,
        `"${user.signupDate || ''}"`,
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `event-hub-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `Data for ${users.length} users has been exported.`,
    });
  };

  return (
    <DashboardLayout user={currentUser} type="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Users className="mr-2 h-8 w-8" />
              Customer Relationship Management
            </h1>
            <p className="text-muted-foreground">
              Manage and market to your users based on their preferences and location
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <Filter className="inline mr-2 h-4 w-4" />
                Filters
              </CardTitle>
              <CardDescription>
                Filter users by location and interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city-filter">Location</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger id="city-filter" className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-filter">Event Interest</Label>
                <Select 
                  value={selectedCategory || ""}
                  onValueChange={(value) => setSelectedCategory(value || null)}
                >
                  <SelectTrigger id="category-filter" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or phone"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Selected Users</span>
                  <Badge variant="outline">{selectedUsers.length}</Badge>
                </div>

                <div className="space-x-2">
                  <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        disabled={selectedUsers.length === 0}
                        className="gap-1.5"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Send Email Campaign</DialogTitle>
                        <DialogDescription>
                          Send an email to {selectedUsers.length} selected users.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-subject">Subject</Label>
                          <Input
                            id="email-subject"
                            placeholder="Email subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-body">Email Content</Label>
                          <Textarea
                            id="email-body"
                            placeholder="Type your email content here..."
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={!emailSubject || !emailBody}>
                          Send Email
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={selectedUsers.length === 0}
                        className="gap-1.5"
                      >
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Send SMS Campaign</DialogTitle>
                        <DialogDescription>
                          Send an SMS to {selectedUsers.length} selected users.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="sms-message">Message</Label>
                          <Textarea
                            id="sms-message"
                            placeholder="Type your SMS message here..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="min-h-[120px]"
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {messageText.length}/160 characters
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSmsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendSms} disabled={!messageText}>
                          Send SMS
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  User Database
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {filteredUsers.length} users
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users match your filter criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleSelectUser(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} className="h-8 w-8" />
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Joined: {user.signupDate || "N/A"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.email || "No email"}
                              <div className="text-xs text-muted-foreground">
                                {user.phone || "No phone"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                              {user.location?.city || "Unknown location"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.interests && user.interests.length > 0 ? (
                                user.interests.slice(0, 2).map((interest) => (
                                  <Badge variant="outline" key={interest} className="text-xs">
                                    {interest}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">No interests</span>
                              )}
                              {user.interests && user.interests.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.interests.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUsers([user.id]);
                                    setIsEmailDialogOpen(true);
                                  }}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUsers([user.id]);
                                    setIsSmsDialogOpen(true);
                                  }}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  SMS User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    // View user profile - in a real app this would navigate to a user detail page
                                    console.log("View user profile:", user);
                                    toast({
                                      title: "User Profile",
                                      description: `Viewing profile for ${user.name}`,
                                    });
                                  }}
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CrmDashboard;
