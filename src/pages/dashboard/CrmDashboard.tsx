import { useState, useMemo } from "react";
import { Users, Download } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { EventCategory, User } from "@/types";
import { currentUser } from "@/lib/data/users";

import UserFilters from "@/components/dashboard/crm/UserFilters";
import SelectedUsersActions from "@/components/dashboard/crm/SelectedUsersActions";
import UsersTable from "@/components/dashboard/crm/UsersTable";
import EmailDialog from "@/components/dashboard/crm/EmailDialog";
import SmsDialog from "@/components/dashboard/crm/SmsDialog";

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

const cities = ["All Cities", "London", "Manchester", "Birmingham", "Leeds"];

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

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = 
        searchQuery === "" || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery);
      
      const matchesCity = 
        selectedCity === "All Cities" || 
        user.location?.city === selectedCity;
      
      const matchesCategory = 
        !selectedCategory || 
        user.interests?.includes(selectedCategory as EventCategory);
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [searchQuery, selectedCity, selectedCategory]);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getSelectedUsersData = () => {
    return mockUsers.filter(user => selectedUsers.includes(user.id));
  };

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

  const handleEmailUser = (userId: string) => {
    setSelectedUsers([userId]);
    setIsEmailDialogOpen(true);
  };

  const handleSmsUser = (userId: string) => {
    setSelectedUsers([userId]);
    setIsSmsDialogOpen(true);
  };

  return (
    <DashboardLayout user={currentUser} type="organizer">
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
                Filters
              </CardTitle>
              <CardDescription>
                Filter users by location and interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserFilters 
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cities={cities}
                categories={categories}
              />

              <Separator className="my-4" />
              
              <SelectedUsersActions 
                selectedUsersCount={selectedUsers.length}
                openEmailDialog={() => setIsEmailDialogOpen(true)}
                openSmsDialog={() => setIsSmsDialogOpen(true)}
              />
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
              <UsersTable 
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onEmailUser={handleEmailUser}
                onSmsUser={handleSmsUser}
              />
            </CardContent>
          </Card>
        </div>

        <EmailDialog 
          isOpen={isEmailDialogOpen}
          onOpenChange={setIsEmailDialogOpen}
          recipientCount={selectedUsers.length}
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          emailBody={emailBody}
          setEmailBody={setEmailBody}
          onSendEmail={handleSendEmail}
        />

        <SmsDialog 
          isOpen={isSmsDialogOpen}
          onOpenChange={setIsSmsDialogOpen}
          recipientCount={selectedUsers.length}
          messageText={messageText}
          setMessageText={setMessageText}
          onSendSms={handleSendSms}
        />
      </div>
    </DashboardLayout>
  );
};

export default CrmDashboard;
