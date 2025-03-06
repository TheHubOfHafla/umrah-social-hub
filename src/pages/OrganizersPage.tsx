
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, UserRound, Building, LandmarkIcon, HeartHandshake, Users, ExternalLink } from "lucide-react";

import { organizers } from "@/lib/data/organizers";
import { EventOrganizer } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const OrganizersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get organizers data
  const { data: organizersData, isLoading } = useQuery({
    queryKey: ["organizers"],
    queryFn: () => Promise.resolve(organizers),
    initialData: organizers,
  });

  // Filter organizers based on search query and selected type
  const filteredOrganizers = organizersData.filter((organizer) => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (organizer.bio && organizer.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType ? organizer.organizationType === selectedType : true;
    
    return matchesSearch && matchesType;
  });

  const getOrganizerTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <UserRound className="h-4 w-4" />;
      case 'mosque':
        return <LandmarkIcon className="h-4 w-4" />;
      case 'charity':
        return <HeartHandshake className="h-4 w-4" />;
      case 'company':
        return <Building className="h-4 w-4" />;
      case 'scholar':
        return <UserRound className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const renderOrganizerCard = (organizer: EventOrganizer) => {
    const initials = organizer.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const typeLabel = organizer.organizationType.charAt(0).toUpperCase() + 
                      organizer.organizationType.slice(1);
    
    return (
      <Card key={organizer.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:translate-y-[-6px] group">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={organizer.avatar} alt={organizer.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary">{organizer.name}</h3>
              <Badge variant="outline" className="flex items-center gap-1 mt-1 transition-colors duration-300 group-hover:bg-primary/10">
                {getOrganizerTypeIcon(organizer.organizationType)}
                {typeLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 transition-colors duration-300 group-hover:bg-primary/5">
          <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">{organizer.bio}</p>
        </CardContent>
        {organizer.website && (
          <CardFooter className="border-t pt-4 transition-colors duration-300 group-hover:bg-primary/5">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 w-full transition-all duration-300 group-hover:border-primary/30 group-hover:text-primary" 
              asChild
            >
              <a href={organizer.website} target="_blank" rel="noopener noreferrer">
                Visit Website <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-2 mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Organizers</h1>
          <p className="text-muted-foreground text-lg">
            Discover event organizers from the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search organizers..." 
              className="pl-9 transition-all duration-300 focus:border-primary/50 focus:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-initial transition-colors duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="mosque" className="flex-1 md:flex-initial transition-colors duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Mosques</TabsTrigger>
              <TabsTrigger value="charity" className="flex-1 md:flex-initial transition-colors duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Charities</TabsTrigger>
              <TabsTrigger value="company" className="flex-1 md:flex-initial transition-colors duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Companies</TabsTrigger>
              <TabsTrigger value="scholar" className="flex-1 md:flex-initial transition-colors duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Scholars</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="h-9 w-full bg-slate-200 rounded animate-pulse" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredOrganizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizers.map(renderOrganizerCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No organizers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizersPage;
