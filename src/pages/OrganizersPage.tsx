import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, UserRound, Building, LandmarkIcon, HeartHandshake, Users, ExternalLink, ChevronDown, Eye } from "lucide-react";

import { organizers } from "@/lib/data/organizers";
import { EventOrganizer } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const OrganizersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: organizersData, isLoading } = useQuery({
    queryKey: ["organizers"],
    queryFn: () => Promise.resolve(organizers),
    initialData: organizers,
  });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const handleViewProfile = (organizerId: string) => {
    navigate(`/organizer/${organizerId}`);
  };

  const renderOrganizerCard = (organizer: EventOrganizer, index: number) => {
    const initials = organizer.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const typeLabel = organizer.organizationType.charAt(0).toUpperCase() + 
                      organizer.organizationType.slice(1);
    
    return (
      <motion.div
        key={organizer.id}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={() => handleViewProfile(organizer.id)}
        className="cursor-pointer"
      >
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 group h-full flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
                <AvatarImage src={organizer.avatar} alt={organizer.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary">{organizer.name}</h3>
                <Badge variant="outline" className="flex items-center gap-1 mt-1 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/30">
                  {getOrganizerTypeIcon(organizer.organizationType)}
                  {typeLabel}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 transition-colors duration-300 group-hover:bg-primary/5 flex-grow">
            <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">{organizer.bio}</p>
          </CardContent>
          <CardFooter className="border-t pt-4 transition-colors duration-300 group-hover:bg-primary/5">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 w-full transition-all duration-300 hover:border-purple-400/50 hover:text-purple-600 relative overflow-hidden" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(organizer.id);
              }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                View Profile 
                <Eye className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <span className="absolute inset-0 bg-purple-50 transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.organizer-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
          card.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col space-y-2 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Organizers</h1>
          <p className="text-muted-foreground text-lg">
            Discover event organizers from the community.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative group">
            <div className={`absolute inset-0 bg-white rounded-md transition-all duration-300 shadow-sm ${isSearchFocused ? 'shadow-primary/20 ring-2 ring-primary/30' : 'shadow-sm'}`}></div>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : ''}`} />
            
            <Input 
              placeholder="Search organizers by name or description..." 
              className={`pl-9 transition-all duration-300 bg-transparent relative z-10 border-none ${isSearchFocused ? 'placeholder:text-primary/50' : ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary z-10"
                onClick={() => setSearchQuery("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            )}
          </div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white p-1 rounded-md shadow-sm">
              <Tabs 
                defaultValue="all" 
                className="w-full md:w-auto" 
                onValueChange={(value) => setSelectedType(value === "all" ? null : value)}
              >
                <TabsList className="grid grid-cols-6 w-full md:flex md:w-auto gap-1 p-1 bg-transparent">
                  <TabsTrigger 
                    value="all" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mosque" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md flex items-center gap-1"
                  >
                    <LandmarkIcon className="h-3.5 w-3.5 hidden md:inline" />
                    <span>Mosques</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="charity" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md flex items-center gap-1"
                  >
                    <HeartHandshake className="h-3.5 w-3.5 hidden md:inline" />
                    <span>Charities</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="company" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md flex items-center gap-1"
                  >
                    <Building className="h-3.5 w-3.5 hidden md:inline" />
                    <span>Companies</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="scholar" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md flex items-center gap-1"
                  >
                    <UserRound className="h-3.5 w-3.5 hidden md:inline" />
                    <span>Speakers</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="individual" 
                    className="flex-1 md:flex-initial transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md flex items-center gap-1"
                  >
                    <Users className="h-3.5 w-3.5 hidden md:inline" />
                    <span>Others</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-slate-200 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="h-9 w-full bg-slate-200 rounded" />
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        ) : filteredOrganizers.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredOrganizers.map((organizer, index) => renderOrganizerCard(organizer, index))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <Search className="h-12 w-12 text-primary/30" />
              <h3 className="text-lg font-medium mb-2">No organizers found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any organizers matching your search or filter criteria.
              </p>
              {searchQuery || selectedType ? (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType(null);
                  }}
                >
                  Clear all filters
                </Button>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrganizersPage;
